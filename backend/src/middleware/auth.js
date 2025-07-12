import User from '../db/models/User.js';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwtUtils.js';
import { errorResponse } from '../utils/utils.js';

const auth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.header('Authorization'));
    
    if (!token) {
      return res.status(401).json(errorResponse('Access denied. No token provided.', null, 401));
    }

    const verification = verifyAccessToken(token);
    
    if (!verification.valid) {
      return res.status(401).json(errorResponse(verification.error, null, 401));
    }

    const user = await User.findById(verification.decoded.userId);

    if (!user) {
      return res.status(401).json(errorResponse('Invalid token. User not found.', null, 401));
    }

    if (!user.isActive) {
      return res.status(401).json(errorResponse('Account is deactivated.', null, 401));
    }

    req.userId = verification.decoded.userId;
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json(errorResponse('Internal server error.'));
  }
};

export default auth; 