import Message from '../models/Message.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * POST /api/messages
 * Persists a new message. Real-time delivery is handled separately via Socket.io;
 * this REST endpoint guarantees the message is durably stored.
 */
export const createMessage = asyncHandler(async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
    status: 'sent',
    timestamp: new Date(),
  });

  res.status(201).json({ success: true, data: newMessage });
});

/**
 * GET /api/messages?userId=&withUser=
 * Fetches the full chronological chat history between two users.
 */
export const getConversation = asyncHandler(async (req, res) => {
  const { userId, withUser } = req.query;

  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: withUser },
      { senderId: withUser, receiverId: userId },
    ],
  }).sort({ timestamp: 1 });

  res.status(200).json({ success: true, data: messages });
});

/**
 * PATCH /api/messages/read
 * Marks every message from `withUser` to `userId` as read (used when a chat window is opened).
 */
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { userId, withUser } = req.body;

  const result = await Message.updateMany(
    { senderId: withUser, receiverId: userId, status: { $ne: 'read' } },
    { $set: { status: 'read' } }
  );

  res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
});
