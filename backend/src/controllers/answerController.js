import Question from '../db/models/Question.js';
import Answer from '../db/models/Answer.js';
import Notification from '../db/models/Notification.js';
import { sendNotification } from '../../index.js';

// Post a new answer to a question
export const postAnswer = async (req, res) => {
  try {
    const { questionId, content, userTagged = [] } = req.body;
    const user = req.user._id;
    const username = req.user.username;
    if (!questionId || !content || !user) {
      return res.status(400).json({ message: 'questionId, content, and user are required.' });
    }
    const answer = new Answer({
      question: questionId,
      user,
      content,
      replies: []
    });
    await answer.save();

    // Notify question owner if not answering own question
    const question = await Question.findById(questionId).populate('user');
    if (question && question.user && question.user.username !== username) {
      const notification = await Notification.create({
        recipient: question.user.username,
        type: 'answer',
        question: questionId,
        answer: answer._id,
        fromUser: username,
        message: `${username} answered your question.`
      });
      sendNotification(question.user.username, notification);
    }

    // Notify tagged users
    for (const tagged of userTagged) {
      const notification = await Notification.create({
        recipient: tagged,
        type: 'answer',
        question: questionId,
        answer: answer._id,
        fromUser: username,
        message: `You were tagged in an answer by ${username}`
      });
      sendNotification(tagged, notification);
    }
    res.status(201).json({ message: 'Answer posted successfully', answer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post answer', error: error.message });
  }
};

// Reply to an answer
export const replyToAnswer = async (req, res) => {
  try {
    const { answerId, content, userTagged = [] } = req.body;
    const user = req.user._id;
    const username = req.user.username;
    if (!answerId || !content || !user) {
      return res.status(400).json({ message: 'answerId, content, and user are required.' });
    }
    const answer = await Answer.findById(answerId).populate('user');
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    answer.replies.push({ user, content });
    await answer.save();

    // Notify answer owner if not replying to own answer
    if (answer.user && answer.user.username !== username) {
      const notification = await Notification.create({
        recipient: answer.user.username,
        type: 'reply',
        question: answer.question,
        answer: answer._id,
        fromUser: username,
        message: `${username} replied to your answer.`
      });
      sendNotification(answer.user.username, notification);
    }

    // Notify tagged users in reply
    for (const tagged of userTagged) {
      const notification = await Notification.create({
        recipient: tagged,
        type: 'reply',
        question: answer.question,
        answer: answer._id,
        fromUser: username,
        message: `You were tagged in a reply by ${username}`
      });
      sendNotification(tagged, notification);
    }
    res.status(201).json({ message: 'Reply added successfully', answer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
}; 