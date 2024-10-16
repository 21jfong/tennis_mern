import mongoose from 'mongoose';

const playerSchema = mongoose.Schema({
  name: { type: String, required: true },
  user_id: { type: String }
});

export default mongoose.model('Player', playerSchema);