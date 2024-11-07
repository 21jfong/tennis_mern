import mongoose from "mongoose";
import Team from "../models/team.js";
import Player from "../models/player.js";
import Match from "../models/match.js";

export const getMatches = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "No team with that ID." });
    const team = await Team.findById(id).populate("captain players");

    const playerIds = team.players.map((player) => player._id);

    const matches = await Match.find({ players: { $in: playerIds } }).populate(
      "players"
    );

    res.status(200).json(matches);
  } catch (error) {
    res.status(404).json({ message: "Error finding matches" });
  }
};

export const createMatch = async (req, res) => {
  const match = req.body;

  try {
    const newMatch = new Match({ ...match, players });

    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(409).json({ message: "Error saving match" });
  }
};
