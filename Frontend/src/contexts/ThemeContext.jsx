import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const THEME_STORAGE_KEY = "student-needs-theme";

const ThemeContext = createContext(undefined);

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const legacy = localStorage.getItem("theme");
  if (legacy === "light" || legacy === "dark") return legacy;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

const applyThemeToDocument = (theme) => {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.remove("light", "dark", "light-theme", "dark-theme");
  root.classList.add(isDark ? "dark" : "light");
  root.classList.add(isDark ? "dark-theme" : "light-theme");
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;

  localStorage.setItem(THEME_STORAGE_KEY, theme);
  localStorage.setItem("theme", theme);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return resolved === "light" ? "light" : "dark";
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

/* Apply saved theme before React paint to avoid flash */
if (typeof document !== "undefined") {
  applyThemeToDocument(getInitialTheme());
}
