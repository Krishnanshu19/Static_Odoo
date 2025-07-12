import Question from '../db/models/Question.js';

export const submitQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const user = req.user._id; // Assumes user is set by auth middleware

    if (!title || !description || !Array.isArray(tags) || !user) {
      return res.status(400).json({ message: 'All fields are required: title, description, tags, user.' });
    }

    const question = new Question({
      title,
      description,
      tags,
      user
    });
    await question.save();
    res.status(201).json({ message: 'Question submitted successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit question', error: error.message });
  }
}; 