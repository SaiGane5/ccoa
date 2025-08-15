/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- This path is crucial
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#111113',
        'brand-gray': '#1C1C1E',
        'brand-light-gray': '#3A3A3C',
        'brand-accent': '#0A84FF',
      }
    },
  },
  plugins: [],
}