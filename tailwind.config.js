/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Inter matches what the Lovable originals actually rendered
        // (their TT Norms Pro files were never shipped, so they fell back).
        sans: ['"Inter"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        // Brand colors — fixed across both themes
        joshway: {
          cyan: "#42c6ee",
          purple: "#7687f3",
          dark: "#08090d", // fixed near-black brand ink (text on bright, logo)
          surface: "rgb(var(--jw-surface) / <alpha-value>)",
          elevated: "rgb(var(--jw-elevated) / <alpha-value>)",
          border: "rgb(var(--jw-hairline) / <alpha-value>)",
        },
        // Page background token (was bg-joshway-dark) — flips per theme
        surface: "rgb(var(--surface) / <alpha-value>)",

        // Neutrals remapped to theme variables so every existing
        // text-white / bg-white/x / border-white/x / text-gray-N utility
        // auto-inverts between light and dark with no per-file edits.
        white: "rgb(var(--wk) / <alpha-value>)",
        gray: {
          50: "rgb(var(--g-50) / <alpha-value>)",
          100: "rgb(var(--g-100) / <alpha-value>)",
          200: "rgb(var(--g-200) / <alpha-value>)",
          300: "rgb(var(--g-300) / <alpha-value>)",
          400: "rgb(var(--g-400) / <alpha-value>)",
          500: "rgb(var(--g-500) / <alpha-value>)",
          600: "rgb(var(--g-600) / <alpha-value>)",
          700: "rgb(var(--g-700) / <alpha-value>)",
          800: "rgb(var(--g-800) / <alpha-value>)",
          900: "rgb(var(--g-900) / <alpha-value>)",
        },
        // Accent text shades used on status chips — darker in light mode
        // so they stay readable on white / on tinted washes.
        amber: {
          200: "rgb(var(--amber-200) / <alpha-value>)",
          300: "rgb(var(--amber-300) / <alpha-value>)",
          400: "rgb(var(--amber-400) / <alpha-value>)",
          500: "#f59e0b",
        },
        emerald: {
          300: "rgb(var(--emerald-300) / <alpha-value>)",
          400: "rgb(var(--emerald-400) / <alpha-value>)",
          500: "#10b981",
        },
        blue: {
          300: "rgb(var(--blue-300) / <alpha-value>)",
          500: "#3b82f6",
        },
        red: {
          300: "rgb(var(--red-300) / <alpha-value>)",
          500: "#ef4444",
        },
        purple: {
          300: "rgb(var(--purple-300) / <alpha-value>)",
          500: "#a855f7",
        },
        // shadcn semantic tokens (used by the scoped course player theme)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(66, 198, 238, 0.35)",
        card: "var(--shadow-card)",
      },
      backgroundImage: {
        mesh: "var(--mesh)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
