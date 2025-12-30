/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom zinc shades for perfect minimal design
        zinc: {
          950: '#09090b',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontWeight: {
        'extralight': 200,
        'light': 300,
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'widest': '0.2em',
      },
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