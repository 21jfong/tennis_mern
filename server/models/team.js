import mongoose from 'mongoose';

const teamSchema = mongoose.Schema({
  name: { type: String, required: true },
  captain: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true }],
  teamCode: { type: String, unique: true, required: true },
});

export default mongoose.model('Team', teamSchema);