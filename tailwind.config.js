/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        forest: {
          DEFAULT: '#2D5016',
          light: '#3a6b1e',
          dark: '#1e3a0e',
        },
        sand: '#D4A76A',
        sky: '#5DADE2',
      },
    },
  },
  plugins: [],
};
