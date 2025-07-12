import Vote from '../db/models/Vote.js';
import Question from '../db/models/Question.js';
import { sendUserNotification } from './notificationController.js';

export const vote = async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;
    const user = req.user._id;
    const username = req.user.username;
    if (!['question', 'answer', 'reply'].includes(targetType) || !['up', 'down'].includes(voteType) || !targetId || !user) {
      return res.status(400).json({ message: 'Invalid or missing fields: targetType, targetId, voteType, user.' });
    }
    const existingVote = await Vote.findOne({ targetType, targetId, user });
    if (existingVote && existingVote.voteType === voteType) {
      return res.status(200).json({ message: 'Already voted', vote: existingVote });
    }
    const filter = { targetType, targetId, user };
    const update = { voteType };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const vote = await Vote.findOneAndUpdate(filter, update, options);

    // Send notification if voting on a question and not self-voting
    if (targetType === 'question') {
      const question = await Question.findById(targetId).populate('user', 'username');
      if (question && question.user && String(question.user._id) !== String(user)) {
        await sendUserNotification({
          recipient: question.user.username,
          type: 'answer', // Reuse 'answer' type for vote notification
          question: targetId,
          fromUser: username,
          message: `${username} ${voteType === 'up' ? 'upvoted' : 'downvoted'} your question.`
        });
      }
    }

    res.status(200).json({ message: 'Vote registered', vote });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register vote', error: error.message });
  }
}; 