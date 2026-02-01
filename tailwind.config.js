/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        accent: '#22C55E',
        background: '#0F172A',
        card: '#1E293B',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8'
      }
    },
  },
  plugins: [],
}