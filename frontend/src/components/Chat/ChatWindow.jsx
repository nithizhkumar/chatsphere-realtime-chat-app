import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Scrollable pane rendering the active conversation's messages in
 * chronological order, auto-scrolling to the newest one.
 */
const ChatWindow = ({ messages, currentUserId, isLoading, isOtherTyping, contactName }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner label="Loading messages" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto thin-scrollbar px-4 sm:px-8 py-6 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">No messages yet</p>
          <p className="text-xs">Say hello to {contactName} 👋</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} isOwn={msg.senderId === currentUserId} />
        ))
      )}
      {isOtherTyping && <TypingIndicator name={contactName} />}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
