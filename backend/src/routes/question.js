import express from 'express';
import { submitQuestion, getQuestions, getQuestionById } from '../controllers/questionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Submit a new question
router.post('/', auth, submitQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestionById);

export default router; 