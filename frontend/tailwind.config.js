/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep indigo/navy for the sidebar rail, matching the reference UI
        navy: {
          950: '#161327',
          900: '#1c1836',
          800: '#241f45',
        },
        // Primary accent (sent bubbles, active states, buttons)
        accent: {
          50: '#f1efff',
          100: '#e3dfff',
          400: '#8b7cf6',
          500: '#7c6ee6',
          600: '#6a5cd6',
          700: '#5847bd',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(28, 24, 54, 0.08)',
        bubble: '0 2px 8px -2px rgba(124, 110, 230, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: 0, transform: 'scale(0.92) translateY(6px)' },
          '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
        },
        blink: {
          '0%, 80%, 100%': { opacity: 0.25 },
          '40%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'pop-in': 'pop-in 0.2s ease-out',
        blink: 'blink 1.4s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
