import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { loginUser } from '../services/authService';
import { isValidUsername, isValidMobile } from '../utils/validators';
import ErrorBanner from '../components/common/ErrorBanner';
import logo from '../assets/logo.png';

const Login = () => {
  const [mode, setMode] = useState('username'); // 'username' | 'mobile'
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmed = value.trim();

    if (mode === 'username' && !isValidUsername(trimmed)) {
      setError('Username must be 3-20 characters: letters, numbers, and underscores only.');
      return;
    }
    if (mode === 'mobile' && !isValidMobile(trimmed)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = mode === 'username' ? { username: trimmed } : { mobileNumber: trimmed };
      const user = await loginUser(payload);
      login(user);
      navigate('/chat');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-navy-950 px-4 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 animate-pop-in">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logo}
            alt="App logo"
            className="w-14 h-14 rounded-2xl object-cover shadow-bubble mb-4 bg-white"
          />
          <h1 className="text-xl font-bold text-navy-900">Welcome to ChatSphere</h1>
          <p className="text-sm text-gray-400 mt-1 text-center">
            No password needed — just enter your username or mobile number.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {['username', 'mobile'].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setValue('');
                setError(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === m ? 'bg-white shadow-soft text-accent-600' : 'text-gray-400'
              }`}
            >
              {m === 'username' ? 'Username' : 'Mobile Number'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="text-xs font-semibold text-gray-500 mb-1.5 block">
              {mode === 'username' ? 'Username' : 'Mobile number'}
            </label>
            <input
              id="identifier"
              type={mode === 'mobile' ? 'tel' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={mode === 'username' ? 'e.g. nithish_dev' : 'e.g. 9876543210'}
              maxLength={mode === 'mobile' ? 10 : 20}
              className="w-full bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm border border-transparent focus:border-accent-400 outline-none transition-colors placeholder:text-gray-400"
              autoFocus
            />
          </div>

          <ErrorBanner message={error} onDismiss={() => setError(null)} />

          <button
            type="submit"
            disabled={isSubmitting || !value.trim()}
            className="w-full bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 rounded-xl shadow-bubble transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            {isSubmitting ? 'Signing in…' : 'Continue'}
          </button>
        </form>

        <p className="text-[11px] text-gray-400 text-center mt-6">
          New here? Just continue — an account is created automatically.
        </p>
      </div>
    </div>
  );
};

export default Login;
