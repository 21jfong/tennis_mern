import express from 'express';
import auth from '../middleware/auth.js';
import { getTeams, createTeam } from '../controllers/teams.js';

const router = express.Router();

router.get('/', auth, getTeams);
router.post('/create-team', auth, createTeam);

export default router;