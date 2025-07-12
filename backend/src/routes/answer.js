import express from 'express';
import { postAnswer, replyToAnswer } from '../controllers/answerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Post a new answer to a question
router.post('/', auth, postAnswer);

// Reply to an answer
router.post('/reply', auth, replyToAnswer);

export default router; 