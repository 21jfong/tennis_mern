import express from 'express';
import auth from '../middleware/auth.js';
import { createTeam } from '../controllers/teams.js';

const router = express.Router();

router.post('/create-team', auth, createTeam);

export default router;