import mongoose from "mongoose";
import User from "../models/user.js";

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "No player with that ID." });

    const player = await User.findById(id);

    res.status(200).json(player);
  } catch (error) {
    res.status(404).json({ message: `Error finding player with id: ${error}` });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "No player with that ID." });
    }

    const updatedPlayer = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlayer) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(updatedPlayer);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating player: ${error.message}` });
  }
};
