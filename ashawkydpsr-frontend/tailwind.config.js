/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a3a5c',
        accent: '#4A90E2',
        success: '#27ae60',
        warning: '#e67e22',
        danger: '#e74c3c',
      }
    },
  },
  plugins: [],
}