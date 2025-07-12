import Notification from '../db/models/Notification.js';

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