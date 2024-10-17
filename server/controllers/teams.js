import mongoose from 'mongoose';
import Team from '../models/team.js';
import Player from '../models/player.js';

export const createTeam = async (req, res) => {
  const team = req.body;
  const captain = await Player.findOne({ user_id: team.captain.result._id });
  const updatedTeam = { name: team.name, captain, players: team.players }

  const newTeam = new Team({ ...updatedTeam });
  console.log(newTeam);
  try {
    await newTeam.save();
    res.status(201).json(newTeam);

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}