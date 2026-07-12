import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Avatar from '../components/common/Avatar';
import logo from '../assets/logo.png';

const NAV_ITEMS = [
  {
    key: 'chats',
    label: 'Chats',
    icon: (
      <path
        fillRule="evenodd"
        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
        clipRule="evenodd"
      />
    ),
  },
  {
    key: 'starred',
    label: 'Starred',
    icon: (
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    ),
  },
  {
    key: 'contacts',
    label: 'Contacts',
    icon: (
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    ),
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: (
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    ),
  },
];

const NavIcon = ({ children, active, label, onClick }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
      active ? 'bg-accent-500 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'
    }`}
  >
    {children}
  </button>
);

/**
 * Slide-over panel used for the Starred / Contacts / Settings nav sections.
 * Rendered over the main content area; closes via the close button or backdrop click.
 */
const SidePanel = ({ title, onClose, children }) => (
  <div className="absolute inset-0 z-30 flex">
    <div className="absolute inset-0 bg-navy-950/30 backdrop-blur-[1px] animate-fade-in" onClick={onClose} />
    <div className="relative ml-auto h-full w-full sm:w-[360px] bg-white shadow-2xl flex flex-col animate-pop-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-navy-900">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-navy-900 transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto thin-scrollbar">{children}</div>
    </div>
  </div>
);

/**
 * App shell: a slim dark navigation rail on the far left plus the main
 * content area. The rail is stateful — each icon opens a real panel
 * (Contacts / Starred / Settings) rather than being purely decorative.
 */
const MainLayout = ({ children, users = [], onSelectChat }) => {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('chats');

  const handleNavClick = (key) => {
    setActiveNav((current) => (current === key ? 'chats' : key));
  };

  const handleContactClick = (contact) => {
    onSelectChat?.(contact);
    setActiveNav('chats');
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Icon rail */}
      <nav className="hidden sm:flex flex-col items-center justify-between w-[72px] bg-navy-950 py-6 shrink-0">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="App logo"
            className="w-10 h-10 rounded-xl object-cover shadow-bubble mb-4 bg-white"
          />
          {NAV_ITEMS.map((item) => (
            <NavIcon
              key={item.key}
              label={item.label}
              active={activeNav === item.key}
              onClick={() => handleNavClick(item.key)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                {item.icon}
              </svg>
            </NavIcon>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button onClick={logout} aria-label="Log out" title="Log out" className="text-white/40 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <Avatar name={user?.username || user?.mobileNumber} size="sm" />
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex min-w-0 relative">
        {children}

        {activeNav === 'contacts' && (
          <SidePanel title="Contacts" onClose={() => setActiveNav('chats')}>
            {users.length === 0 ? (
              <p className="text-center text-sm text-gray-400 mt-10 px-4">No contacts yet</p>
            ) : (
              <div className="p-3 space-y-1">
                {users.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleContactClick(c)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left hover:bg-accent-50 transition-colors"
                  >
                    <Avatar name={c.username || c.mobileNumber} online={c.online} showStatus />
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900 truncate">{c.username || c.mobileNumber}</p>
                      <p className="text-xs text-gray-400">{c.online ? 'Online' : 'Offline'}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </SidePanel>
        )}

        {activeNav === 'starred' && (
          <SidePanel title="Starred messages" onClose={() => setActiveNav('chats')}>
            <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-gray-400 px-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-sm font-medium">No starred messages yet</p>
              <p className="text-xs max-w-[220px]">Long-press or right-click a message to star it for quick access later.</p>
            </div>
          </SidePanel>
        )}

        {activeNav === 'settings' && (
          <SidePanel title="Settings" onClose={() => setActiveNav('chats')}>
            <div className="p-5 space-y-6">
              <div className="flex items-center gap-3">
                <Avatar name={user?.username || user?.mobileNumber} size="lg" />
                <div>
                  <p className="font-bold text-navy-900">{user?.username || user?.mobileNumber}</p>
                  <p className="text-xs text-emerald-500 font-medium">● Online</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 rounded-xl transition-colors"
              >
                Log out
              </button>
            </div>
          </SidePanel>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
