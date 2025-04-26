import mongoose from 'mongoose';

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  teamCode: { type: String, unique: true, required: true },
});

export default mongoose.model('Team', teamSchema);