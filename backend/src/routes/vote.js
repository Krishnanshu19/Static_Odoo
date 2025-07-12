import express from 'express';
import { vote } from '../controllers/voteController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register a vote (upvote/downvote) for question, answer, or reply
router.post('/', auth, vote);

export default router; 