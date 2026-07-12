import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * Validates a new message payload before it is persisted.
 */
export const validateMessageInput = (req, res, next) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
    return next(new ApiError(400, 'A valid senderId is required'));
  }
  if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return next(new ApiError(400, 'A valid receiverId is required'));
  }
  if (!message || !message.trim()) {
    return next(new ApiError(400, 'Message cannot be empty'));
  }
  if (message.trim().length > 2000) {
    return next(new ApiError(400, 'Message cannot exceed 2000 characters'));
  }

  req.body.message = message.trim();
  next();
};

/**
 * Validates query params for fetching a conversation's message history.
 */
export const validateMessageQuery = (req, res, next) => {
  const { userId, withUser } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return next(new ApiError(400, 'A valid userId query parameter is required'));
  }
  if (!withUser || !mongoose.Types.ObjectId.isValid(withUser)) {
    return next(new ApiError(400, 'A valid withUser query parameter is required'));
  }

  next();
};
