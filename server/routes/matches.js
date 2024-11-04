import express from 'express';
import auth from '../middleware/auth.js';
import { getMatches } from '../controllers/matches.js';

const router = express.Router();

router.get('/my-teams/:id/matches', auth, getMatches);
// router.get('/:id', auth, getTeam);
// router.post('/create-team', auth, createTeam);
// router.patch('/:id/edit-team', auth, editTeam);
// router.delete('/:id/edit-team', auth, deleteTeam);
// router.patch('/join-team/:code', auth, joinTeam);

export default router;
