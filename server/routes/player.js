import express from "express";
import { getUser, editUser } from "../controllers/player.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", getUser);
router.post("/:id/edit", auth, editUser);

export default router;
