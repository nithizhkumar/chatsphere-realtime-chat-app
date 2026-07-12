import User from '../models/User.js';
import Message from '../models/Message.js';
import { SOCKET_EVENTS } from '../constants/socketEvents.js';

// Maps a userId -> socketId so we can target direct-message rooms even
// across multiple tabs/devices. Kept in memory (per-server-instance) for speed;
// the source of truth for "online" state is still persisted to MongoDB.
const onlineUsers = new Map();

/**
 * Wires up all Socket.io event listeners. Called once with the `io` server instance.
 */
const registerSocketHandlers = (io) => {
  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    /**
     * JOIN: a logged-in user announces themselves so we can route
     * direct messages, typing indicators, and presence to them.
     */
    socket.on(SOCKET_EVENTS.JOIN, async (userId) => {
      if (!userId) return;

      // Handle duplicate connections: if this user already has a socket
      // registered (e.g. a stale tab), we simply overwrite it with the newest one.
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      socket.join(userId); // personal room, keyed by userId, for direct delivery

      try {
        const user = await User.findByIdAndUpdate(
          userId,
          { online: true, socketId: socket.id, lastSeen: new Date() },
          { new: true }
        );
        if (user) {
          io.emit(SOCKET_EVENTS.USER_ONLINE, { userId: user._id, lastSeen: user.lastSeen });
        }
      } catch (err) {
        console.error(`[Socket] join error: ${err.message}`);
      }
    });

    /**
     * SEND_MESSAGE: persist the message, then push it to the receiver in real time
     * if they're online, and mark it delivered.
     */
    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (payload) => {
      const { senderId, receiverId, message } = payload || {};
      if (!senderId || !receiverId || !message || !message.trim()) return;

      try {
        const saved = await Message.create({
          senderId,
          receiverId,
          message: message.trim(),
          status: onlineUsers.has(receiverId) ? 'delivered' : 'sent',
          timestamp: new Date(),
        });

        // Deliver to the receiver's personal room (covers multiple tabs/devices)
        io.to(receiverId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, saved);
        // Echo back to the sender (other tabs, and delivery confirmation)
        io.to(senderId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, saved);

        if (onlineUsers.has(receiverId)) {
          io.to(senderId).emit(SOCKET_EVENTS.MESSAGE_DELIVERED, { messageId: saved._id });
        }
      } catch (err) {
        console.error(`[Socket] send-message error: ${err.message}`);
        socket.emit('error-message', { message: 'Failed to send message. Please try again.' });
      }
    });

    /**
     * TYPING / STOP_TYPING: relayed straight through to the intended recipient only.
     */
    socket.on(SOCKET_EVENTS.TYPING, ({ senderId, receiverId, username }) => {
      if (!receiverId) return;
      io.to(receiverId).emit(SOCKET_EVENTS.TYPING, { senderId, username });
    });

    socket.on(SOCKET_EVENTS.STOP_TYPING, ({ senderId, receiverId }) => {
      if (!receiverId) return;
      io.to(receiverId).emit(SOCKET_EVENTS.STOP_TYPING, { senderId });
    });

    /**
     * MESSAGE_READ: bulk-marks a conversation as read and notifies the original sender.
     */
    socket.on(SOCKET_EVENTS.MESSAGE_READ, async ({ userId, withUser }) => {
      if (!userId || !withUser) return;
      try {
        await Message.updateMany(
          { senderId: withUser, receiverId: userId, status: { $ne: 'read' } },
          { $set: { status: 'read' } }
        );
        io.to(withUser).emit(SOCKET_EVENTS.MESSAGE_READ, { readBy: userId });
      } catch (err) {
        console.error(`[Socket] message-read error: ${err.message}`);
      }
    });

    /**
     * DISCONNECT: cleans up presence state gracefully, including for users
     * who close the tab without an explicit logout.
     */
    socket.on(SOCKET_EVENTS.DISCONNECT, async () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      const { userId } = socket;
      if (!userId) return;

      // Only clear presence if this socket is still the "current" one for the user
      // (guards against a stale disconnect firing after a newer tab already joined).
      if (onlineUsers.get(userId) === socket.id) {
        onlineUsers.delete(userId);
        try {
          const lastSeen = new Date();
          await User.findByIdAndUpdate(userId, { online: false, socketId: null, lastSeen });
          io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId, lastSeen });
        } catch (err) {
          console.error(`[Socket] disconnect cleanup error: ${err.message}`);
        }
      }
    });
  });
};

export default registerSocketHandlers;
