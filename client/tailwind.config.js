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
          50: '#f0f6ff',
          100: '#e0ecff',
          200: '#cddfff',
          300: '#a8cafe',
          400: '#81affc',
          500: '#2b6aca',
          600: '#003580', // Booking.com Main Blue
          700: '#002c6b',
          800: '#002456',
          900: '#00193d',
          950: '#001026',
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ffc72c', // SLC Yellow (Main Brand Color)
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
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
        'wave': 'wave 3s ease-in-out infinite',
        'bg-pan': 'bgPan 15s linear infinite alternate',
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
        wave: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bgPan: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
