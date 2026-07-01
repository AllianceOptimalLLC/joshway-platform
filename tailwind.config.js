/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        joshway: {
          cyan: "#42c6ee",
          purple: "#7687f3",
          dark: "#08090d",
          surface: "#12141c",
          elevated: "#1a1d28",
          border: "rgba(255,255,255,0.08)",
        },
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(66, 198, 238, 0.35)",
        card: "0 4px 24px -4px rgba(0,0,0,0.4)",
      },
      backgroundImage: {
        "mesh": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(66,198,238,0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(118,135,243,0.12), transparent)",
      },
    },
  },
  plugins: [],
};