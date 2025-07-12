import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfileValidation, handleValidationErrors, updateProfile);

export default router; 