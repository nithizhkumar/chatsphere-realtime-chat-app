/**
 * Formats a date/timestamp into the "10:30 AM" / "12 Jul 2026" pair used
 * under each message bubble.
 */
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  return { time, day };
};

/**
 * Produces a human-friendly "last seen" label for offline users.
 */
export const formatLastSeen = (timestamp) => {
  if (!timestamp) return 'Offline';
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Last seen just now';
  if (diffMins < 60) return `Last seen ${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Last seen ${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `Last seen ${diffDays}d ago`;
};
