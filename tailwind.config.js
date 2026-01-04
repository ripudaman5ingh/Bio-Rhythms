/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        monitor: {
          bg: '#050505',
          grid: '#1a1a1a',
          scan: '#2a0033', // Dark violet scan bg
          line: '#a855f7', // Violet-500 equivalent
          ui: '#581c87',   // Darker violet for UI borders
          text: '#d8b4fe'  // Light violet text
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
      },
      animation: {
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
