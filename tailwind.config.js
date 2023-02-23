/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {fontSize: {
    sm: '0.8rem',
    base: '1rem',
  },
    extend: {},
  },
  plugins: [],
}
