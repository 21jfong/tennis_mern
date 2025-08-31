import mongoose from 'mongoose';

const trackingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  N: { type: Number, default: 0 },
  S: { type: Number, default: 0 },
}, { timestamps: true });

trackingSchema.index({ user: 1, date: 1 }, { unique: true });

const Tracking = mongoose.model('Tracking', trackingSchema);
export default Tracking;
