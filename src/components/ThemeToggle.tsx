import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-100 hover:bg-white/10 transition-colors shrink-0"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-full flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] px-3 py-2.5 text-sm text-gray-400 hover:text-gray-100 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
