import mongoose from "mongoose";

const matchSchema = mongoose.Schema({
  teams: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: false },
  ],
  date: { type: Date, default: new Date() },
  players: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Player", required: true },
  ],
  score: { type: String, required: true },
});

export default mongoose.model("Match", matchSchema);
