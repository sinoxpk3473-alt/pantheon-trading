/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pantheon: {
          bg: "#080a10",       // Deep WEEX-style dark navy
          card: "#121620",     // Glass panel background
          gold: "#FFD700",     // Institutional Gold
          green: "#00E396",    // Buy Signal Green
          red: "#FF4560",      // Sell Signal Red
          accent: "#2962FF",   // Professional Blue Accent
          text: "#E0E6ED",     // High readability text
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}