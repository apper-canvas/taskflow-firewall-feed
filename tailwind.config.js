/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#5B4FF7',
          400: '#7B68EE',
          600: '#4A3FD6',
        },
        accent: {
          500: '#FF6B6B',
          400: '#FF8A8A',
          600: '#E55555',
        },
        success: '#4ECDC4',
        warning: '#FFE66D',
        info: '#4A90E2',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B4FF7 0%, #7B68EE 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF6B6B 0%, #FF8A8A 100%)',
        'gradient-success': 'linear-gradient(135deg, #4ECDC4 0%, #44B3AA 100%)',
      },
      animation: {
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-out': 'slideOut 0.3s ease-in',
        'bounce-check': 'bounceCheck 0.4s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        bounceCheck: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}