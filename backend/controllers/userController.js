import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/users
 * Returns every user except the one making the request (query param `exclude`).
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { exclude } = req.query;
  const filter = exclude ? { _id: { $ne: exclude } } : {};

  const users = await User.find(filter).select('-socketId').sort({ online: -1, lastSeen: -1 });

  res.status(200).json({ success: true, data: users });
});

/**
 * GET /api/users/online
 * Returns only users currently marked online.
 */
export const getOnlineUsers = asyncHandler(async (req, res) => {
  const { exclude } = req.query;
  const filter = exclude ? { online: true, _id: { $ne: exclude } } : { online: true };

  const users = await User.find(filter).select('-socketId');

  res.status(200).json({ success: true, data: users });
});
