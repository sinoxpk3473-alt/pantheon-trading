/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. THE NEW LUXURY PALETTE
      colors: {
        vantablack: '#050505',
        gold: '#D4AF37',
        copper: '#4B6E6A',
        alabaster: '#F0F0F0',
        obsidian: '#0A0A0A',
        // Kept this just in case you used it somewhere
        zinc: { 950: '#09090b' }
      },
      // 2. THE NEW LUXURY FONTS
      fontFamily: {
        monument: ['Cinzel', 'serif'],
        editorial: ['Playfair Display', 'serif'],
        technical: ['Space Mono', 'monospace'],
        // Kept sans as a fallback
        sans: ['Inter', 'sans-serif'],
      },
      // 3. KEPT YOUR USEFUL UTILITIES (Animations, spacing, etc.)
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      blur: {
        '4xl': '120px',
      },
    },
  },
  plugins: [],
}