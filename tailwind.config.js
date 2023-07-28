/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors:{
      "primary": "#f8fafc",
      "primary-dark": "#1e293b",
      "secondary": "#334155",
      "secondary-dark": "#cbd5e1"
    }
  },
  plugins: [],
}
