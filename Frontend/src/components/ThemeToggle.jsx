import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme.js";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = (e) => {
    e.stopPropagation();
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        "relative flex items-center justify-between p-1 rounded-full cursor-pointer select-none transition-all duration-300 ease-out hover:scale-[1.03]",
        "w-[110px] h-10 bg-white/70 dark:bg-slate-950/65 backdrop-blur-[20px] border border-white/30 dark:border-cyan-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(99,102,241,0.15)]",
        className
      )}
      role="switch"
      aria-checked={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun Icon */}
      <div className="flex items-center justify-center w-12 h-8 z-10 transition-colors duration-300 text-amber-500">
        <Sun className={cn("w-4.5 h-4.5 transition-transform duration-300", !isDark ? "opacity-100 scale-100" : "opacity-40 scale-90")} />
      </div>

      {/* Slider Knob */}
      <div
        className={cn(
          "absolute left-1 top-1 bottom-1 w-12 rounded-full bg-white dark:bg-indigo-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/10 dark:border-indigo-500/35 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center",
          isDark ? "translate-x-[54px]" : "translate-x-0"
        )}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/30 dark:bg-white" />
      </div>

      {/* Moon Icon */}
      <div className="flex items-center justify-center w-12 h-8 z-10 transition-colors duration-300 text-slate-400 dark:text-indigo-200">
        <Moon className={cn("w-4.5 h-4.5 transition-transform duration-300", isDark ? "opacity-100 scale-100" : "opacity-40 scale-90")} />
      </div>
    </div>
  );
};

export default ThemeToggle;
