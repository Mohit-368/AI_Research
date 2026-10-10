import mongoose from 'mongoose';
import Message from '../models/message.model.js';
import Source from '../models/source.model.js';
import Critique from '../models/critique.model.js';
import Feedback from '../models/feedback.model.js';
import { paginationSchema } from '../schemas/request.schemas.js';
import { researchGraph } from '../services/langgraph.service.js';

const publicResearch = (message) => ({
  id: message._id,
  messageId: message._id,
  query: message.prompt,
  prompt: message.prompt,
  title: message.title || '',
  status: message.status,
  output: message.output || '',
  writer_output: message.output || '',
  error: message.status === 'failed' ? 'Research could not be completed.' : undefined,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
});

export const createResearch = async (request, response) => {
  const { query } = request.body;
  const message = await Message.create({ user: request.user._id, prompt: query, status: 'in_progress' });
  try {
    const result = await researchGraph.invoke({ query });
    const uniqueSources = new Map();
    for (const source of (result.source || [])) {
      if (source.url && !uniqueSources.has(source.url)) uniqueSources.set(source.url, source);
    }
    const sourceDocuments = [...uniqueSources.values()].map((source) => ({
      message: message._id,
      title: source.title || '',
      url: source.url,
      snippet: source.snippet || '',
      content: source.content || '',
    }));
    if (!sourceDocuments.length) throw new Error('Research completed without any usable sources');

    await Source.insertMany(sourceDocuments, { ordered: false });
    const critique = await Critique.create({
      message: message._id,
      score: result.score,
      strengths: result.strengths || [],
      weaknesses: result.weaknesses || [],
      missingInformation: result.missingInformation || [],
      suggestions: result.suggestions || [],
      feedback: result.feedback || '',
    });
    message.title = result.title || query.slice(0, 100);
    message.output = result.writer_output || '';
    message.status = 'completed';
    message.error = undefined;
    await message.save();

    return response.status(201).json({
      message: 'Research completed successfully',
      data: {
        ...publicResearch(message),
        sources: sourceDocuments.map(({ message: _message, ...source }) => source),
        critique: {
          score: critique.score,
          strengths: critique.strengths,
          weaknesses: critique.weaknesses,
          missingInformation: critique.missingInformation,
          suggestions: critique.suggestions,
          feedback: critique.feedback,
        },
      },
    });
  } catch (error) {
    await Promise.allSettled([
      Source.deleteMany({ message: message._id }),
      Critique.deleteOne({ message: message._id }),
    ]);
    message.status = 'failed';
    message.error = (error?.message || 'Research failed').slice(0, 500);
    await message.save().catch((saveError) => console.error('Could not persist research failure state:', saveError.message));
    console.error('Research job failed:', error.message);
    return response.status(502).json({
      message: 'Research could not be completed. Please try again later.',
      researchId: message._id,
      status: 'failed',
    });
  }
};

export const getResearchById = async (request, response) => {
  const { id } = request.params;
  if (!mongoose.isValidObjectId(id)) return response.status(400).json({ message: 'Invalid research ID' });
  const message = await Message.findOne({ _id: id, user: request.user._id }).lean();
  if (!message) return response.status(404).json({ message: 'Research not found' });
  const [sources, critique] = await Promise.all([
    Source.find({ message: message._id }).select('-content').sort({ createdAt: 1 }).lean(),
    Critique.findOne({ message: message._id }).select('-__v').lean(),
  ]);
  return response.status(200).json({ data: { ...publicResearch(message), sources, critique } });
};

export const getUsersAllResearch = async (request, response) => {
  const parsedPagination = paginationSchema.safeParse(request.query);
  if (!parsedPagination.success) return response.status(400).json({ message: 'Invalid pagination parameters' });
  const { page, limit } = parsedPagination.data;
  const filter = { user: request.user._id };
  const [items, total] = await Promise.all([
    Message.find(filter).select('-output -error').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Message.countDocuments(filter),
  ]);
  return response.status(200).json({ data: items.map(publicResearch), pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

export const addFeedbackToResearch = async (request, response) => {
  const { id } = request.params;
  if (!mongoose.isValidObjectId(id)) return response.status(400).json({ message: 'Invalid research ID' });
  const ownedMessage = await Message.findOne({ _id: id, user: request.user._id }).select('_id').lean();
  if (!ownedMessage) return response.status(404).json({ message: 'Research not found' });
  const { feedback, rating } = request.body;
  const review = await Feedback.create({ message: ownedMessage._id, user: request.user._id, feedback, rating });
  return response.status(201).json({ data: { id: review._id, message: review.message, feedback: review.feedback, rating: review.rating, createdAt: review.createdAt } });
};
