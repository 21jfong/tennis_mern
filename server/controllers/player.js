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
  const newPlayer = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "No player with that ID." });

    const updatedPlayer = await User.findByIdAndUpdate(
      id,
      {
        name: newPlayer.name,
        email: newPlayer.email,
        password: newPlayer.password,
      },
      { new: true }
    );

    res.json(updatedPlayer);
  } catch (error) {
    res
      .status(404)
      .json({ message: `Error finding and editing player with id: ${error}` });
  }
};
