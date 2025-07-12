import express from 'express';
import { submitQuestion } from '../controllers/questionController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Submit a new question
router.post('/', auth, submitQuestion);

export default router; 