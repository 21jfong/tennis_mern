import Tracking from '../models/tracking.js';
import Team from '../models/team.js';

export const getUserMonthStats = async (req, res) => {
  try {
    const { userId, month } = req.params; // month: YYYY-MM
    const stats = await Tracking.find({
      user: userId,
      date: { $regex: `^${month}` },
    });
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user stats', error: err.message });
  }
};

// Get all players' tracking stats for a team for a month (captain only)
export const getTeamMonthStats = async (req, res) => {
  try {
    const { teamId, month } = req.params;
    const team = await Team.findById(teamId).populate('players captain');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (String(team.captain._id) !== String(req.userId)) {
      return res.status(403).json({ message: 'Only the captain can access team stats' });
    }
    const playerIds = team.players.map((p) => p._id);
    const stats = await Tracking.find({
      user: { $in: playerIds },
      date: { $regex: `^${month}` },
    });
    res.status(200).json({ players: team.players, stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team stats', error: err.message });
  }
};

// Save or update a user's tracking stat for a day
export const saveUserDayStat = async (req, res) => {
  try {
    const { date } = req.body; // YYYY-MM-DD
    let { N, S } = req.body;
    const userId = req.userId;
    if (!date) return res.status(400).json({ message: 'Date required' });
    // Ensure N and S are numbers, default to 0 if empty or invalid
    N = N === undefined || N === null || N === '' ? 0 : Number(N);
    S = S === undefined || S === null || S === '' ? 0 : Number(S);
    const updated = await Tracking.findOneAndUpdate(
      { user: userId, date },
      { N, S },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error saving stat', error: err.message });
  }
};

// Edit a user's tracking stat for a day
export const editUserDayStat = async (req, res) => {
  try {
    const { date } = req.params; // YYYY-MM-DD
    let { N, S } = req.body;
    const userId = req.userId;
    if (!date) return res.status(400).json({ message: 'Date required' });
    // Ensure N and S are numbers, default to 0 if empty or invalid
    N = N === undefined || N === null || N === '' ? 0 : Number(N);
    S = S === undefined || S === null || S === '' ? 0 : Number(S);
    const updated = await Tracking.findOneAndUpdate(
      { user: userId, date },
      { N, S },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Tracking stat not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error editing stat', error: err.message });
  }
};
