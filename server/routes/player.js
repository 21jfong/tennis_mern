import express from "express";
import {
  getPlayer,
} from "../controllers/player.js";

const router = express.Router();

router.get("/:id", getPlayer);

export default router;
