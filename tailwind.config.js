/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          950: '#0c0a09', // Confirming value or using Tailwind default if not overriding
          800: '#292524',
          700: '#44403c',
          50: '#fafaf9',
          400: '#a8a29e',
          DEFAULT: '#8C8880',
        },
        linen: {
          DEFAULT: "#F0EAD6",
          dark: "#E6DDD0",
        },
        charcoal: {
          DEFAULT: "#2C2C2C",
          light: "#4A4A4A",
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        orange: {
          300: '#fdba74',
        },
        // Adding custom colors from HTML as well just in case
        "primary": "#FFB74D",
        "primary-dark": "#F57C00",
        "background-dark": "#1F150A",
        "solar-deep": "#2D1B0E",
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"DM Sans"', 'sans-serif'], // Mapping display to DM Sans as per prompt
        numeric: ['"Outfit"', 'sans-serif'],
        serif: ['"Crimson Pro"', 'serif'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjRjBFQUQ2Ii8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNFNkRERDAiLz4KPC9zdmc+')",
      },
      backdropBlur: {
        xl: '24px',
      },
      animation: {
        'breathe': 'breathe 8s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
