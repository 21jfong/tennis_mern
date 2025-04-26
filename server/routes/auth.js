import express from "express";
import {
  signup,
  signin,
  googlesignin,
  checkHealth,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/googlesignin", googlesignin);
router.get("/health", checkHealth);

export default router;
