const COLORS = [
  'bg-rose-400',
  'bg-amber-400',
  'bg-emerald-400',
  'bg-sky-400',
  'bg-violet-400',
  'bg-pink-400',
];

const getColorForName = (name = '') => {
  const code = name.charCodeAt(0) || 0;
  return COLORS[code % COLORS.length];
};

const getInitials = (name = '?') => name.trim().slice(0, 1).toUpperCase();

/**
 * Circular avatar showing a user's initial, with an optional online-status dot.
 */
const Avatar = ({ name, size = 'md', online, showStatus = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div className="relative shrink-0">
      <div
        className={`${sizeClasses[size]} ${getColorForName(
          name
        )} rounded-full flex items-center justify-center font-semibold text-white shadow-soft select-none`}
      >
        {getInitials(name)}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            online ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
          aria-label={online ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

export default Avatar;
