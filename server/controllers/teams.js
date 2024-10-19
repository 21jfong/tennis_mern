import mongoose from 'mongoose';
import Team from '../models/team.js';
import Player from '../models/player.js';
import crypto from 'crypto';

const generateTeamCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // Example: 'A1B2C3'
};

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
  const updatedTeam = { name: team.name, captain, players: team.players, teamCode: generateTeamCode() }

  const newTeam = new Team({ ...updatedTeam });

  try {
    await newTeam.save();
    res.status(201).json(newTeam);

  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const joinTeam = async (req, res) => {
  const { code } = req.params;
  if (!req.userId) return res.json({ message: "Unauthenticated" });

  const team = await Team.findOne({ teamCode: code });
  if (!team) return res.status(404).send(`No Team with that code ${teamCode}.`);

  const player = await Player.findOne({ user_id: req.userId });
  team.players.push(player);

  const updatedTeam = await Team.findByIdAndUpdate(team.id, team, { new: true });
  res.json(updatedTeam);
}