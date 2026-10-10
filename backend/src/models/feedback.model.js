import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  feedback: { type: String, trim: true, maxlength: 2000, default: '' },
  rating: { type: Number, min: 1, max: 5, required: true },
}, { timestamps: true });
export default mongoose.model('Feedback', feedbackSchema);
