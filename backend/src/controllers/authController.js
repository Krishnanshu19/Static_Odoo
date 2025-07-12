import User from '../db/models/User.js';
import { generateAccessToken } from '../utils/jwtUtils.js';
import { successResponse, errorResponse, logError } from '../utils/utils.js';

// Register User
const register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      name
    });

    await user.save();

    // Generate token
    const token = generateAccessToken(user._id, user.email);

    res.status(201).json(successResponse('User registered successfully', {
      user: user.toJSON(),
      token
    }, 201));

  } catch (error) {
    logError(error, 'Registration error');
    res.status(500).json(errorResponse('Internal server error', error.message));
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    console.log("Login request received:", { email, username });
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (username) {
      user = await User.findOne({ username });
    }
    if (!user) {
      return res.status(400).json(errorResponse('Invalid credentials', null, 400));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json(errorResponse('Invalid credentials', null, 400));
    }
    // Generate token
    const token = generateAccessToken(user._id, user.email);
    res.status(200).json(successResponse('Login successful', {
      user: user.toJSON(),
      token
    }, 200));
  } catch (error) {
    logError(error, 'Login error');
    res.status(500).json(errorResponse('Internal server error', error.message));
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json(successResponse('Profile retrieved successfully', {
      user: user.toJSON()
    }));

  } catch (error) {
    logError(error, 'Get profile error');
    res.status(500).json(errorResponse('Internal server error', error.message));
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name, username } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({ username, _id: { $ne: req.userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
      updates.username = username;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json(successResponse('Profile updated successfully', {
      user: user.toJSON()
    }));

  } catch (error) {
    logError(error, 'Update profile error');
    res.status(500).json(errorResponse('Internal server error', error.message));
  }
};

export {
  register,
  login,
  getProfile,
  updateProfile
}; 