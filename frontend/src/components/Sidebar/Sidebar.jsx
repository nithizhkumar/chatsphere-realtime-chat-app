import { useMemo, useState } from 'react';
import UserListItem from './UserListItem';
import LoadingSpinner from '../common/LoadingSpinner';
import Avatar from '../common/Avatar';

/**
 * Left conversation panel: shows the current user, a search box, and the
 * full contact list split into Online / Offline sections.
 */
const Sidebar = ({ currentUser, users, isLoading, activeChat, onSelectChat }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.username || u.mobileNumber || '').toLowerCase().includes(q));
  }, [users, search]);

  const onlineUsers = filtered.filter((u) => u.online);
  const offlineUsers = filtered.filter((u) => !u.online);

  return (
    <aside className="w-full sm:w-[320px] shrink-0 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Current user header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <Avatar name={currentUser.username || currentUser.mobileNumber} size="md" />
        <div className="min-w-0">
          <p className="font-bold text-navy-900 truncate">
            {currentUser.username || currentUser.mobileNumber}
          </p>
          <p className="text-xs text-emerald-500 font-medium">● Online</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations…"
            className="w-full bg-gray-50 focus:bg-white text-sm rounded-xl pl-10 pr-3 py-2.5 border border-transparent focus:border-accent-400 outline-none transition-colors placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto thin-scrollbar px-3 pb-4 space-y-1">
        {isLoading ? (
          <div className="py-10">
            <LoadingSpinner label="Loading contacts" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-10">No contacts found</p>
        ) : (
          <>
            {onlineUsers.length > 0 && (
              <div className="mb-1">
                <p className="px-2 py-1.5 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                  Online — {onlineUsers.length}
                </p>
                {onlineUsers.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    isActive={activeChat?._id === u._id}
                    onClick={() => onSelectChat(u)}
                  />
                ))}
              </div>
            )}
            {offlineUsers.length > 0 && (
              <div>
                <p className="px-2 py-1.5 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                  Offline — {offlineUsers.length}
                </p>
                {offlineUsers.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    isActive={activeChat?._id === u._id}
                    onClick={() => onSelectChat(u)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
