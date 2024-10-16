import express from 'express';
import { signup, signin, googlesignin } from '../controllers/users.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/googlesignin', googlesignin);

export default router;