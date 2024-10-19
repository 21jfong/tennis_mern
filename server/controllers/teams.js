import mongoose from 'mongoose';
import Team from '../models/team.js';
import Player from '../models/player.js';

export const getTeams = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const player = await Player.findOne({ user_id: req.userId })
    const teams = await Team.find({
      $or: [
        { 'captain': player.id },
        { 'players': player.id }
      ]
    });

    res.status(200).json(teams);
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
};

export const createTeam = async (req, res) => {
  const team = req.body;
  const captain = await Player.findOne({ user_id: req.userId });
  const updatedTeam = { name: team.name, captain, players: team.players }

  const newTeam = new Team({ ...updatedTeam });

  try {
    await newTeam.save();
    res.status(201).json(newTeam);

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}