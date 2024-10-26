import express from 'express';
import auth from '../middleware/auth.js';
import { getTeam, getTeams, createTeam, editTeam, deleteTeam, joinTeam, removePlayer } from '../controllers/teams.js';

const router = express.Router();

router.get('/', auth, getTeams);
router.get('/:id', auth, getTeam);
router.post('/create-team', auth, createTeam);
router.patch('/create-team/:id', auth, editTeam);
router.delete('/edit-team/:id', auth, deleteTeam);
router.patch('/join-team/:code', auth, joinTeam);
router.patch('/edit-team/:teamId/:playerId', auth, removePlayer);

export default router;
