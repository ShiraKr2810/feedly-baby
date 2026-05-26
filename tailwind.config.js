/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'Alef', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 22px 60px rgba(83, 112, 145, 0.11)',
        lift: '0 10px 30px rgba(93, 130, 165, 0.10)',
        night: '0 24px 80px rgba(6, 16, 30, 0.42)',
      },
      colors: {
        app: '#F8FBFF',
        card: '#FFFFFF',
        primary: '#A9D8F5',
        'primary-hover': '#91CBEE',
        'primary-text': '#243447',
        pink: '#F7CFE1',
        'pink-surface': '#FDECF5',
        'blue-surface': '#EAF6FD',
        lavender: '#E8DDFB',
        peach: '#FFEDE5',
        'text-main': '#334155',
        'text-muted': '#8A94A6',
        line: '#DDEAF5',
        night: '#26364A',
        'night-card': '#31445A',
        'night-blue': '#BFE3F8',
        'night-pink': '#F7CFE1',
      },
    },
  },
  plugins: [],
};
