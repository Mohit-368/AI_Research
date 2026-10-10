import mongoose from 'mongoose';

const critiqueSchema = new mongoose.Schema({
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true, unique: true },
  score: { type: Number, required: true, min: 0, max: 10, validate: Number.isInteger },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  missingInformation: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  feedback: { type: String, trim: true, maxlength: 3000, default: '' },
}, { timestamps: true });
export default mongoose.model('Critique', critiqueSchema);
