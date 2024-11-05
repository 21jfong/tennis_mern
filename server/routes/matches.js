import express from "express";
import auth from "../middleware/auth.js";
import { getMatches, createMatch } from "../controllers/matches.js";

const router = express.Router();

router.get("/my-teams/:id/matches", auth, getMatches);
// router.get('/:id', auth, getTeam);
router.post("/matches/create-match", auth, createMatch);
// router.patch('/:id/edit-team', auth, editTeam);
// router.delete('/:id/edit-team', auth, deleteTeam);
// router.patch('/join-team/:code', auth, joinTeam);

export default router;
