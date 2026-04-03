/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#2D3748',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        prosto: ['"Prosto One"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
