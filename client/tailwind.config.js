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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      animation: {
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.8, 0, 1, 1)',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marqueeReverse 25s linear infinite',
        'marquee-scroll': 'marqueeScroll 50s linear infinite',
        'ken-burns-1': 'kenBurns1 20s ease-out forwards',
        'ken-burns-2': 'kenBurns2 20s ease-out forwards',
        'ken-burns-3': 'kenBurns3 25s ease-out forwards',
        'ken-burns-4': 'kenBurns4 25s ease-out forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
          '70%': { transform: 'scale(0.9)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marqueeScroll: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        kenBurns1: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.2) translate(-3%, -2%)' },
        },
        kenBurns2: {
          '0%': { transform: 'scale(1.2) translate(-1%, 2%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
        kenBurns3: {
          '0%': { transform: 'scale(1.25) translate(2%, 1%)' },
          '100%': { transform: 'scale(1.1) translate(0, 0)' },
        },
        kenBurns4: {
          '0%': { transform: 'scale(1.1) translate(-2%, -1%)' },
          '100%': { transform: 'scale(1) translate(2%, 2%)' },
        },
      },
    },
  },
  plugins: [],
}
