import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
  title: { type: String, trim: true, maxlength: 300, default: '' },
  url: { type: String, required: true, trim: true, maxlength: 2048 },
  snippet: { type: String, trim: true, maxlength: 2000, default: '' },
  content: { type: String, trim: true, maxlength: 100000, default: '' },
}, { timestamps: true });
sourceSchema.index({ message: 1, url: 1 }, { unique: true });
export default mongoose.model('Source', sourceSchema);
