import express from 'express';
import auth from '../middleware/auth.js';
import { getTeams, createTeam, joinTeam } from '../controllers/teams.js';

const router = express.Router();

router.get('/', auth, getTeams);
router.post('/create-team', auth, createTeam);
router.patch('/join-team/:code', auth, joinTeam);

export default router;
