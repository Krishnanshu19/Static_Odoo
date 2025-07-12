import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['answer', 'reply'],
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    default: null
  },
  fromUser: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema); 