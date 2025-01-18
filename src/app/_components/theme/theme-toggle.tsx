"use client";

import * as React from "react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <label className={`flex h-full cursor-pointer items-center ${className}`}>
      <input
        type="checkbox"
        className="hidden"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <div className="relative h-8 w-14">
        <div className="block h-full w-full rounded-full bg-gray-300"></div>
        <div
          className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
            theme === "dark" ? "translate-x-full transform bg-gray-800" : ""
          }`}
        ></div>
      </div>
    </label>
  );
}
