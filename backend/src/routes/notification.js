import express from 'express';
import { getNotifications } from '../controllers/notificationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getNotifications);

export default router; 