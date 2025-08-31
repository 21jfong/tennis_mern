import express from 'express';
import auth from '../middleware/auth.js';
import * as trackingCtrl from '../controllers/tracking.js';

const router = express.Router();

// Get a user's tracking stats for a month
router.get('/user/:userId/:month', auth, trackingCtrl.getUserMonthStats);

// Get all players' tracking stats for a team for a month (captain only)
router.get('/team/:teamId/:month', auth, trackingCtrl.getTeamMonthStats);

// Save or update a user's tracking stat for a day
router.post('/user', auth, trackingCtrl.saveUserDayStat);

// Edit a user's tracking stat for a day (PATCH)
router.patch('/user/:date', auth, trackingCtrl.editUserDayStat);

export default router;
