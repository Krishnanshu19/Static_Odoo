import Question from '../db/models/Question.js';
import Answer from '../db/models/Answer.js';
import Vote from '../db/models/Vote.js';

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

export const getQuestions = async (req, res) => {
  try {
    const { filter } = req.query;
    let questions;
    if (filter === 'popular') {
      // Sort by most upvotes
      questions = await Question.aggregate([
        {
          $lookup: {
            from: 'votes',
            let: { qid: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [ { $eq: ['$targetType', 'question'] }, { $eq: ['$targetId', '$$qid'] }, { $eq: ['$voteType', 'up'] } ] } } }
            ],
            as: 'upvotes'
          }
        },
        { $addFields: { upvoteCount: { $size: '$upvotes' } } },
        { $sort: { upvoteCount: -1, createdAt: -1 } }
      ]);
    } else if (filter === 'unanswered') {
      // Questions with no answers
      const answeredIds = await Answer.distinct('question');
      questions = await Question.find({ _id: { $nin: answeredIds } }).sort({ createdAt: -1 });
    } else {
      // Newest (default)
      questions = await Question.find().sort({ createdAt: -1 });
    }
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
}; 