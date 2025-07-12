import Vote from '../db/models/Vote.js';

export const vote = async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;
    const user = req.user._id;
    if (!['question', 'answer', 'reply'].includes(targetType) || !['up', 'down'].includes(voteType) || !targetId || !user) {
      return res.status(400).json({ message: 'Invalid or missing fields: targetType, targetId, voteType, user.' });
    }
    const filter = { targetType, targetId, user };
    const update = { voteType };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const vote = await Vote.findOneAndUpdate(filter, update, options);
    res.status(200).json({ message: 'Vote registered', vote });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register vote', error: error.message });
  }
}; 