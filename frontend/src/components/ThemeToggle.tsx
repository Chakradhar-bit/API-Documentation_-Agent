import { useState } from "react";
import { IconMoon, IconSun } from "./icons";

type Theme = "light" | "dark";

const STORAGE_KEY = "ada-theme";

function detectTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light/Dark switch for the header. Persists the choice in localStorage and
 * falls back to the system preference on first visit. Colors transition via
 * the `theme-anim` class (enabled only while switching), so the layout never
 * animates.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(detectTheme);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-anim");
    root.classList.toggle("dark", next === "dark");
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-anim"), 320);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-surface text-ink-soft shadow-panel transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:text-ink hover:shadow-btn active:scale-[0.97]"
    >
      {isDark ? (
        <IconSun className="h-4 w-4 text-amber-600" />
      ) : (
        <IconMoon className="h-4 w-4 text-blue-600" />
      )}
    </button>
  );
}
