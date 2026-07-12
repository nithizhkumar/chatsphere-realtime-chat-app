import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { isValidMessage } from '../../utils/validators';

// Lazy-loaded since the emoji picker is a fairly large bundle and only needed on demand
const EmojiPicker = lazy(() => import('emoji-picker-react'));

const MessageInput = ({ onSend, onTyping, onStopTyping, disabled }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) {
      onTyping();
    } else {
      onStopTyping();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidMessage(text)) return;
    onSend(text.trim());
    setText('');
    onStopTyping();
    inputRef.current?.focus();
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker((s) => !s)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-accent-500 transition-colors"
          aria-label="Add emoji"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 4.95a.75.75 0 10-1.06-1.06 3.5 3.5 0 01-4.95 0 .75.75 0 00-1.06 1.06 5 5 0 007.07 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-0 z-20 animate-fade-in">
            <Suspense fallback={<div className="bg-white rounded-xl shadow-soft p-4 text-xs text-gray-400">Loading…</div>}>
              <EmojiPicker onEmojiClick={handleEmojiClick} height={360} width={300} />
            </Suspense>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={handleChange}
        onBlur={onStopTyping}
        placeholder={disabled ? 'Connecting…' : 'Type a message…'}
        disabled={disabled}
        className="flex-1 bg-gray-50 focus:bg-white rounded-2xl px-4 py-3 text-sm border border-transparent focus:border-accent-400 outline-none transition-colors placeholder:text-gray-400 disabled:opacity-60"
        maxLength={2000}
      />

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-accent-500 text-white shadow-bubble hover:bg-accent-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 -ml-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
