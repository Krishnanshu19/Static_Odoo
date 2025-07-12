import Notification from '../db/models/Notification.js';
import { sendNotification } from '../../index.js';

export const getNotifications = async (req, res) => {
  try {
    const username = req.user.username;
    const notifications = await Notification.find({ recipient: username })
      .sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

export const sendUserNotification = async ({ recipient, type, question, answer = null, fromUser, message }) => {
  const notification = await Notification.create({
    recipient,
    type,
    question,
    answer,
    fromUser,
    message
  });
  sendNotification(recipient, notification);
  return notification;
}; 