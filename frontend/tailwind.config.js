/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F5F0E6',
        forest: '#1B4332',
        lime: '#B06A12',
        marigold: '#B06A12',
        accent: '#B06A12',
        'marigold-dark': '#96580D',
        'surface': '#FEF9EF',
        'surface-container': '#F2EDE3',
        'surface-container-low': '#F8F3E9',
        'surface-container-high': '#EDE8DE',
        'surface-container-highest': '#E7E2D8',
        'on-surface': '#1D1C16',
        'on-surface-variant': '#414844',
        'outline': '#717973',
        'outline-variant': '#C1C8C2',
        'primary': '#012D1D',
        'primary-container': '#1B4332',
        'secondary-container': '#B06A12',
        'tertiary-container': '#15442F'
      },
      fontFamily: {
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        dmsans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        'card': '0.5rem',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};
