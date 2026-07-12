const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

/**
 * Simple accessible spinner used for auth, message-fetch, and socket-connect loading states.
 */
const LoadingSpinner = ({ size = 'md', label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
    <div
      className={`${SIZES[size]} rounded-full border-accent-200 border-t-accent-500 animate-spin`}
      style={{ borderTopColor: '#7c6ee6', borderColor: 'rgba(124,110,230,0.2)' }}
    />
    <span className="sr-only">{label}</span>
  </div>
);

export default LoadingSpinner;
