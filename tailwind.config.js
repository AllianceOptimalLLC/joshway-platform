/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        joshway: {
          cyan: "#42c6ee",
          purple: "#7687f3",
          dark: "#0f1117",
          surface: "#1a1d27",
        },
      },
    },
  },
  plugins: [],
};