import { formatMessageTime } from '../../utils/formatTime';

const StatusTicks = ({ status }) => {
  const color = status === 'read' ? 'text-sky-200' : 'text-white/70';
  const isDouble = status === 'delivered' || status === 'read';

  return (
    <span className={`inline-flex ${color}`} aria-label={status}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z" />
      </svg>
      {isDouble && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 -ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 111.414-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z" />
        </svg>
      )}
    </span>
  );
};

/**
 * A single message bubble, styled differently depending on whether it was
 * sent by the current user (right, filled accent) or received (left, white).
 */
const MessageBubble = ({ message, isOwn }) => {
  const { time, day } = formatMessageTime(message.timestamp || message.createdAt);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-pop-in`}>
      <div className={`max-w-[75%] sm:max-w-[60%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
            isOwn
              ? 'bg-accent-500 text-white rounded-2xl rounded-br-md shadow-bubble'
              : 'bg-white text-navy-900 rounded-2xl rounded-bl-md shadow-soft'
          }`}
        >
          {message.message}
        </div>
        <div className={`flex items-center gap-1 mt-1 px-1 text-[11px] text-gray-400`}>
          <span>{time}</span>
          <span className="text-gray-300">•</span>
          <span>{day}</span>
          {isOwn && <StatusTicks status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
