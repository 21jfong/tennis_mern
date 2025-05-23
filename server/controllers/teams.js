import mongoose from "mongoose";
import Team from "../models/team.js";
import User from "../models/user.js";
import crypto from "crypto";

const generateTeamCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // Example: 'A1B2C3'
};

export const getTeams = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const teams = await Team.find({
      $or: [{ captain: req.userId }, { players: req.userId }],
    }).populate("captain players");

    res.status(200).json(teams.reverse());
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTeam = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ message: "No team with that ID." });

    const team = await Team.findById(id).populate("captain players");

    res.status(200).json(team);
  } catch (error) {
    res.status(404).json({ message: "Error finding team" });
  }
};

export const createTeam = async (req, res) => {
  const team = req.body;
  const captain = await User.findById(req.userId);
  const updatedTeam = {
    name: team.name,
    captain,
    players: [captain],
    teamCode: generateTeamCode(),
  };

  const newTeam = new Team({ ...updatedTeam });

  try {
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(409).json({ message: "Error saving team" });
  }
};

export const editTeam = async (req, res) => {
  const { id } = req.params;
  const newTeam = req.body;
  const userId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Team not found");
  if (newTeam.oldCaptain._id !== userId)
    return res.status(401).send("Unauthorized");

  let newPlayers = newTeam.players;

  if (
    !newTeam.players.some((player) => player._id === newTeam.captain._id) &&
    newTeam.captain._id != newTeam.oldCaptain._id
  ) {
    newPlayers.push(newTeam.oldCaptain);
  }

  const updatedTeam = await Team.findByIdAndUpdate(
    id,
    { name: newTeam.name, captain: newTeam.captain, players: newPlayers },
    { new: true }
  );

  res.json(updatedTeam);
};

export const deleteTeam = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

  try {
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: `Team not found` });

    await Team.findByIdAndDelete(id);

    res.status(200).json({ message: "Team deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting team", error: error.message });
  }
};

export const joinTeam = async (req, res) => {
  const { code } = req.params;
  if (!req.userId) return res.status(401).json({ message: "Unauthenticated" });

  const team = await Team.findOne({ teamCode: code });
  if (!team)
    return res.status(404).json({ message: `No Team with code: ${code}` });

  const player = await User.findById(req.userId);

  if (!team.players.includes(req.userId)) {
    team.players.push(player);
    const updatedTeam = await Team.findByIdAndUpdate(team.id, team, {
      new: true,
    });
    res.json(updatedTeam);
  } else {
    return res.status(403).json({ message: "Player is already on the team" });
  }
};
