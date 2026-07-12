import { useCallback, useEffect, useState } from 'react';
import { SOCKET_EVENTS } from '../constants/socketEvents';
import { fetchConversation, markMessagesRead } from '../services/messageService';

/**
 * Owns the message list for whichever conversation is currently open:
 * loads history from the REST API, then keeps it live via Socket.io events.
 */
const useConversation = (socket, currentUser, activeChat) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load chat history whenever the active conversation changes
  useEffect(() => {
    if (!activeChat || !currentUser) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchConversation(currentUser._id, activeChat._id)
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load messages');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    // Mark incoming messages from this user as read, both via REST (durable)
    // and socket (so the sender's tick marks update instantly)
    markMessagesRead(currentUser._id, activeChat._id).catch(() => {});
    socket?.emit(SOCKET_EVENTS.MESSAGE_READ, { userId: currentUser._id, withUser: activeChat._id });

    return () => {
      cancelled = true;
    };
  }, [activeChat, currentUser, socket]);

  // Live updates: new messages, delivered receipts, read receipts
  useEffect(() => {
    if (!socket || !currentUser) return undefined;

    const handleReceive = (incoming) => {
      const isForActiveChat =
        activeChat &&
        ((incoming.senderId === activeChat._id && incoming.receiverId === currentUser._id) ||
          (incoming.senderId === currentUser._id && incoming.receiverId === activeChat._id));

      if (isForActiveChat) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === incoming._id)) return prev;
          return [...prev, incoming];
        });

        // If the message just arrived from the other person while their chat is open, mark it read immediately
        if (incoming.senderId === activeChat._id) {
          markMessagesRead(currentUser._id, activeChat._id).catch(() => {});
          socket.emit(SOCKET_EVENTS.MESSAGE_READ, { userId: currentUser._id, withUser: activeChat._id });
        }
      }
    };

    const handleDelivered = ({ messageId }) => {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? { ...m, status: 'delivered' } : m)));
    };

    const handleRead = ({ readBy }) => {
      if (activeChat && readBy === activeChat._id) {
        setMessages((prev) =>
          prev.map((m) => (m.senderId === currentUser._id ? { ...m, status: 'read' } : m))
        );
      }
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceive);
    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, handleDelivered);
    socket.on(SOCKET_EVENTS.MESSAGE_READ, handleRead);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceive);
      socket.off(SOCKET_EVENTS.MESSAGE_DELIVERED, handleDelivered);
      socket.off(SOCKET_EVENTS.MESSAGE_READ, handleRead);
    };
  }, [socket, currentUser, activeChat]);

  const sendMessage = useCallback(
    (text) => {
      if (!socket || !currentUser || !activeChat || !text.trim()) return;
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        senderId: currentUser._id,
        receiverId: activeChat._id,
        message: text.trim(),
      });
    },
    [socket, currentUser, activeChat]
  );

  return { messages, isLoading, error, sendMessage };
};

export default useConversation;
