import Avatar from '../common/Avatar';
import { formatLastSeen } from '../../utils/formatTime';

/**
 * A single selectable conversation row in the sidebar list.
 */
const UserListItem = ({ user, isActive, onClick }) => {
  const displayName = user.username || user.mobileNumber;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-150 ${
        isActive
          ? 'bg-accent-500 shadow-bubble text-white'
          : 'hover:bg-accent-50 text-navy-900'
      }`}
    >
      <Avatar name={displayName} online={user.online} showStatus />
      <div className="min-w-0 flex-1">
        <p className={`font-semibold truncate ${isActive ? 'text-white' : 'text-navy-900'}`}>
          {displayName}
        </p>
        <p className={`text-xs truncate ${isActive ? 'text-accent-100' : 'text-gray-400'}`}>
          {user.online ? 'Online' : formatLastSeen(user.lastSeen)}
        </p>
      </div>
      {user.online && !isActive && (
        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
};

export default UserListItem;
