/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trading: {
          dark: '#0B0E14',         // Very deep dark background
          card: '#151924',         // Raised cards
          border: '#2A2E39',       // Clean structural borders
          primary: '#2962FF',      // Action buttons
          primaryHover: '#1E4DB7', // Hover state
          green: '#00C087',        // Profit color
          red: '#FF4A68',          // Loss color
          text: '#D1D4DC',         // Standard text
          textMuted: '#787B86',    // Low emphasis text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
