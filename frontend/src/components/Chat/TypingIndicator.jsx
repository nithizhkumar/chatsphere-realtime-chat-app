const TypingIndicator = ({ name }) => (
  <div className="flex items-center gap-2 animate-fade-in">
    <div className="bg-white rounded-2xl rounded-bl-md shadow-soft px-4 py-3 flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-accent-400 animate-blink" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-accent-400 animate-blink" style={{ animationDelay: '160ms' }} />
      <span className="w-2 h-2 rounded-full bg-accent-400 animate-blink" style={{ animationDelay: '320ms' }} />
    </div>
    <span className="text-xs text-gray-400">{name} is typing…</span>
  </div>
);

export default TypingIndicator;
