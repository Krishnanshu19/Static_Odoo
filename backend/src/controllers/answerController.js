import Answer from '../db/models/Answer.js';

// Post a new answer to a question
export const postAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const user = req.user._id;
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
    res.status(201).json({ message: 'Answer posted successfully', answer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to post answer', error: error.message });
  }
};

// Reply to an answer
export const replyToAnswer = async (req, res) => {
  try {
    const { answerId, content } = req.body;
    const user = req.user._id;
    if (!answerId || !content || !user) {
      return res.status(400).json({ message: 'answerId, content, and user are required.' });
    }
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    answer.replies.push({ user, content });
    await answer.save();
    res.status(201).json({ message: 'Reply added successfully', answer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reply', error: error.message });
  }
}; 