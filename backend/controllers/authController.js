import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * POST /api/auth/login
 * Passwordless login: identify a user by username OR mobileNumber.
 * If the user exists, log them in. Otherwise, create a new account automatically.
 */
export const login = asyncHandler(async (req, res) => {
  const { username, mobileNumber } = req.body;

  const query = username ? { username: username.trim() } : { mobileNumber: mobileNumber.trim() };

  let user = await User.findOne(query);
  let isNewUser = false;

  if (!user) {
    user = await User.create(query);
    isNewUser = true;
  }

  user.online = true;
  user.lastSeen = new Date();
  await user.save();

  res.status(isNewUser ? 201 : 200).json({
    success: true,
    message: isNewUser ? 'Account created and logged in' : 'Logged in successfully',
    data: {
      _id: user._id,
      username: user.username,
      mobileNumber: user.mobileNumber,
      online: user.online,
      lastSeen: user.lastSeen,
    },
  });
});

/**
 * POST /api/auth/logout
 * Marks a user offline and clears their socket id.
 */
export const logout = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (userId) {
    await User.findByIdAndUpdate(userId, {
      online: false,
      lastSeen: new Date(),
      socketId: null,
    });
  }

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
