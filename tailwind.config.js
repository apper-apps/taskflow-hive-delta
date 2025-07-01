/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7f4',
          100: '#dcebe3',
          200: '#bdd8ca',
          300: '#94bfa8',
          400: '#6B8E7F',
          500: '#527566',
          600: '#425d52',
          700: '#374c43',
          800: '#2f3f37',
          900: '#29352e',
        },
        secondary: {
          50: '#E8F3ED',
          100: '#d1e7db',
          200: '#a3cfb7',
          300: '#75b793',
          400: '#479f6f',
          500: '#19874b',
          600: '#146c3c',
          700: '#0f512d',
          800: '#0a361e',
          900: '#051b0f',
        },
        accent: {
          50: '#fff1f1',
          100: '#ffdfdf',
          200: '#ffc5c5',
          300: '#ff9d9d',
          400: '#ff6464',
          500: '#FF6B6B',
          600: '#f23030',
          700: '#cc1e1e',
          800: '#a91d1d',
          900: '#8b2020',
        },
        surface: '#FFFFFF',
        background: '#FAFBFC',
        success: '#4ECDC4',
        warning: '#FFE66D',
        error: '#FF6B6B',
        info: '#4A90E2',
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'medium': '0 4px 8px rgba(0, 0, 0, 0.08)',
        'hover': '0 8px 25px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' }
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}