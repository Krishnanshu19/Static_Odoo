import express from 'express';
import { submitQuestion, getQuestions } from '../controllers/questionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Submit a new question
router.post('/', auth, submitQuestion);
router.get('/', getQuestions);

export default router; 