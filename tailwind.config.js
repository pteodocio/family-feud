/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        feud: {
          dark: '#030816',
          board: '#071638',
          navy: '#0b2050',
          blue: '#133580',
          brightBlue: '#1d4ed8',
          gold: '#f5b000',
          goldLight: '#ffd15c',
          goldDark: '#b88200',
          red: '#dc2626',
          redGlow: '#ef4444',
          emerald: '#10b981',
          tileFront: '#0e2b6d',
          tileBorder: '#2563eb',
          egg: '#f8fafc',
        }
      },
      fontFamily: {
        display: ['Impact', 'Arial Black', 'Trebuchet MS', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(245, 176, 0, 0.45), inset 0 0 15px rgba(255, 209, 92, 0.3)',
        'blue-glow': '0 0 30px rgba(29, 78, 216, 0.5), inset 0 0 15px rgba(59, 130, 246, 0.3)',
        'red-strike': '0 0 40px rgba(239, 68, 68, 0.8), inset 0 0 20px rgba(220, 38, 38, 0.5)',
        'stage': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 80px rgba(13, 37, 95, 0.6)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(4px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-6px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(6px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
