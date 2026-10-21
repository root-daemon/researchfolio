"use client";

import { useEffect, useRef } from "react";
import { currentTheme, onThemeChange, setTheme, THEMES } from "@/lib/theme";

// Cycles the phosphor: green, amber, then paper (the light theme).
export default function ThemeToggle() {
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sync = () => { label.current!.textContent = currentTheme(); };
    sync();
    return onThemeChange(sync);
  }, []);

  return (
    <button
      className="theme-toggle"
      aria-label="Switch colour theme"
      onClick={() => setTheme(THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length])}
    >
      <span aria-hidden>◐ </span><span ref={label}>green</span>
    </button>
  );
}
