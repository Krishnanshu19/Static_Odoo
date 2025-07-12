import Question from '../db/models/Question.js';
import Answer from '../db/models/Answer.js';
import Vote from '../db/models/Vote.js';
import User from '../db/models/User.js'; // Added import for User

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
    let questions = [];
    let isAggregate = false;
    if (filter === 'popular') {
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
        {
          $lookup: {
            from: 'votes',
            let: { qid: '$_id' },
            pipeline: [
              { $match: { $expr: { $and: [ { $eq: ['$targetType', 'question'] }, { $eq: ['$targetId', '$$qid'] }, { $eq: ['$voteType', 'down'] } ] } } }
            ],
            as: 'downvotes'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $lookup: {
            from: 'answers',
            localField: '_id',
            foreignField: 'question',
            as: 'answers'
          }
        },
        {
          $addFields: {
            upvoteCount: { $size: '$upvotes' },
            downvoteCount: { $size: '$downvotes' },
            username: { $arrayElemAt: ['$userInfo.username', 0] },
            totalReplies: {
              $sum: {
                $map: {
                  input: '$answers',
                  as: 'ans',
                  in: { $size: { $ifNull: ['$$ans.replies', []] } }
                }
              }
            }
          }
        },
        { $sort: { upvoteCount: -1, createdAt: -1 } }
      ]);
      isAggregate = true;
    } else if (filter === 'unanswered') {
      const answeredIds = await Answer.distinct('question');
      questions = await Question.find({ _id: { $nin: answeredIds } })
        .sort({ createdAt: -1 })
        .populate('user', 'username');
    } else {
      questions = await Question.find()
        .sort({ createdAt: -1 })
        .populate('user', 'username');
    }

    let userVotes = [];
    if (!isAggregate && req.user) {
      userVotes = await Vote.find({
        targetType: 'question',
        targetId: { $in: questions.map(q => q._id) },
        user: req.user._id
      }).lean();
      console.log('userVotes:', userVotes, 'req.user._id:', String(req.user._id));
    }
    if (!isAggregate) {
      const questionIds = questions.map(q => q._id);
      const votes = await Vote.aggregate([
        { $match: { targetType: 'question', targetId: { $in: questionIds } } },
        { $group: { _id: { targetId: '$targetId', voteType: '$voteType' }, count: { $sum: 1 } } }
      ]);
      const answers = await Answer.find({ question: { $in: questionIds } });
      const repliesByQuestion = {};
      const answerCountByQuestion = {};
      for (const ans of answers) {
        repliesByQuestion[ans.question] = (repliesByQuestion[ans.question] || 0) + (ans.replies ? ans.replies.length : 0);
        answerCountByQuestion[ans.question] = (answerCountByQuestion[ans.question] || 0) + 1;
      }
      questions = questions.map(q => {
        const upvote = votes.find(v => String(v._id.targetId) === String(q._id) && v._id.voteType === 'up');
        const downvote = votes.find(v => String(v._id.targetId) === String(q._id) && v._id.voteType === 'down');
        let isVoted = false;
        if (req.user) {
          isVoted = userVotes.some(v =>
            String(v.targetId) === String(q._id) &&
            v.voteType === 'up' &&
            String(v.user) === String(req.user._id)
          );
        }
        return {
          ...q.toObject(),
          upvoteCount: upvote ? upvote.count : 0,
          downvoteCount: downvote ? downvote.count : 0,
          username: q.user && q.user.username ? q.user.username : undefined,
          totalReplies: repliesByQuestion[q._id] || 0,
          answerCount: answerCountByQuestion[q._id] || 0,
          isVoted
        };
      });
    }

    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('user', 'username');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    // Fetch answers for this question, populate user and replies.user
    const answers = await Answer.find({ question: id })
      .populate('user', 'username')
      .lean();
    // For each answer, populate user info for each reply
    for (const answer of answers) {
      if (answer.replies && answer.replies.length > 0) {
        for (const reply of answer.replies) {
          if (reply.user) {
            const replyUser = await User.findById(reply.user).select('username');
            reply.user = replyUser ? { _id: replyUser._id, username: replyUser.username } : reply.user;
          }
        }
      }
    }
    res.status(200).json({
      question,
      answers,
      answerCount: answers.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch question details', error: error.message });
  }
}; 