/**
 * Friendly inline banner for network/API/socket errors. Non-blocking so the
 * rest of the UI stays usable while the issue is visible.
 */
const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="animate-fade-in flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.28 11.184c.75 1.334-.213 2.99-1.742 2.99H3.72c-1.53 0-2.493-1.656-1.743-2.99L8.257 3.1zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
