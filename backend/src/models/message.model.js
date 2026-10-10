import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  prompt: { type: String, required: true, trim: true, maxlength: 1000 },
  title: { type: String, trim: true, maxlength: 300 },
  status: { type: String, enum: ['queued', 'in_progress', 'completed', 'failed'], default: 'in_progress', index: true },
  error: { type: String, trim: true, maxlength: 500 },
  output: { type: String, maxlength: 20000 },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

messageSchema.index({ user: 1, createdAt: -1 });
export default mongoose.model('Message', messageSchema);
