import { useEffect, useRef, useState, useCallback } from 'react';
import { SOCKET_EVENTS } from '../constants/socketEvents';

const STOP_TYPING_DELAY = 1500;

/**
 * Handles both sides of the typing indicator:
 * - emits `typing` / `stop-typing` when the current user types, debounced
 * - listens for the other participant's typing state for the active conversation
 */
const useTypingIndicator = (socket, currentUser, activeChatId) => {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Listen for the other participant typing in the currently open conversation
  useEffect(() => {
    if (!socket) return undefined;

    const handleTyping = ({ senderId }) => {
      if (senderId === activeChatId) setIsOtherTyping(true);
    };
    const handleStopTyping = ({ senderId }) => {
      if (senderId === activeChatId) setIsOtherTyping(false);
    };

    socket.on(SOCKET_EVENTS.TYPING, handleTyping);
    socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

    return () => {
      socket.off(SOCKET_EVENTS.TYPING, handleTyping);
      socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
    };
  }, [socket, activeChatId]);

  // Reset the "other user is typing" flag whenever the active chat changes
  useEffect(() => {
    setIsOtherTyping(false);
  }, [activeChatId]);

  const notifyTyping = useCallback(() => {
    if (!socket || !activeChatId || !currentUser) return;

    socket.emit(SOCKET_EVENTS.TYPING, {
      senderId: currentUser._id,
      receiverId: activeChatId,
      username: currentUser.username,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SOCKET_EVENTS.STOP_TYPING, { senderId: currentUser._id, receiverId: activeChatId });
    }, STOP_TYPING_DELAY);
  }, [socket, activeChatId, currentUser]);

  const notifyStopTyping = useCallback(() => {
    if (!socket || !activeChatId || !currentUser) return;
    clearTimeout(typingTimeoutRef.current);
    socket.emit(SOCKET_EVENTS.STOP_TYPING, { senderId: currentUser._id, receiverId: activeChatId });
  }, [socket, activeChatId, currentUser]);

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  return { isOtherTyping, notifyTyping, notifyStopTyping };
};

export default useTypingIndicator;
