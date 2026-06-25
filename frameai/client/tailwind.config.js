/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ede4d3',
          300: '#dfd0b8',
          400: '#ceb89a',
          500: '#bda07c',
        },
        gold: {
          400: '#d4af6a',
          500: '#c9a84c',
          600: '#b8962e',
        },
        olive: {
          400: '#8b9467',
          500: '#6b7a4a',
          600: '#4d5a2d',
        },
        dark: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 106, 0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(212, 175, 106, 0)' } }
      }
    }
  },
  plugins: []
};
