import mongoose from "mongoose";
import Player from "../models/player.js";

export const getPlayer = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "No player with that ID." });

    const player = await Player.findById(id);

    res.status(200).json(player);
  } catch (error) {
    res.status(404).json({ message: `Error finding player with id: ${error}` });
  }
};
