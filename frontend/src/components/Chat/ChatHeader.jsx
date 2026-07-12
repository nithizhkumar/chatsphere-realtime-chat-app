import Avatar from '../common/Avatar';
import { formatLastSeen } from '../../utils/formatTime';

const ChatHeader = ({ contact, isOtherTyping, isConnected }) => {
  const displayName = contact.username || contact.mobileNumber;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar name={displayName} online={contact.online} showStatus />
        <div className="min-w-0">
          <h2 className="font-bold text-navy-900 truncate">{displayName}</h2>
          <p className="text-xs text-gray-400 h-4">
            {isOtherTyping ? (
              <span className="text-accent-500 font-medium animate-fade-in">
                {displayName} is typing…
              </span>
            ) : contact.online ? (
              'Online'
            ) : (
              formatLastSeen(contact.lastSeen)
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isConnected && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Reconnecting…
          </span>
        )}
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy-900 transition-colors"
          aria-label="Search in conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy-900 transition-colors"
          aria-label="More options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 14a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
