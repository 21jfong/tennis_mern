import express from "express";
import {
  getUser,
} from "../controllers/player.js";

const router = express.Router();

router.get("/:id", getUser);

export default router;
