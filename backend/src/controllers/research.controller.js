import Message from "../models/message.model.js";
import Source from "../models/source.model.js";
import Critique from "../models/critique.model.js";
import { researchGraph } from "../services/langgraph.service.js";
import Feedback from "../models/feedback.model.js";

export const createResearch=async (req, res) => {
    try {
        const { query } = req.body;

        // Create a new Message document for the research job
        const message = new Message({
            query,
            status: "in_progress",
        });
        await message.save();

        // Run the research graph to generate title, sources, and critique
        const result = await researchGraph.run({ query });

        // Update the Message document with the results
        message.title = result.title;
        message.writer_output = result.writer_output;
        message.status = "completed";
        await message.save();

        // Save sources to the database
        const sources = result.source.map((source) => ({
            ...source,
            message: message._id,
        }));
        await Source.insertMany(sources);

        // Save critique to the database
        const critiqueData = {
            message: message._id,
            score: result.score,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            missingInformation: result.missingInformation,
            suggestions: result.suggestions,
            feedback: result.feedback,
        };
        const critique = new Critique(critiqueData);
        await critique.save();

        res.status(201).json({
            message: "Research job created successfully",
            data: {
                messageId: message._id,
                title: message.title,
                writer_output: message.writer_output,
                sources: sources,
                critique: critiqueData,
            },
        });
    } catch (error) {
        console.error("Error creating research job:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getResearchById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id).lean(); 
        if (!message) {
            return res.status(404).json({ error: "Research not found" });
        }
        res.status(200).json({ data: message });
    } catch (error) {
        console.error("Error fetching research by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const getUsersAllResearch = async (req, res) => {
   try{
    const userId = req.user._id; // Assuming you have user authentication and the user ID is available in req.user
    const researchList = await Message.find({ user: userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ data: researchList });       
   }
   catch (error) {
    console.error("Error fetching user's research:", error);
    res.status(500).json({ error: "Internal server error" });
   }
};

export const addFeedbackToResearch = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, rating } = req.body;

        const review = new Feedback({
            message: id,
            feedback,
            rating
        });

        await review.save();

        res.status(201).json({
            data: review
        });

    } catch (error) {
        console.error("Error adding feedback to research:", error);

        res.status(500).json({
            error: "Internal server error"
        });
    }
};