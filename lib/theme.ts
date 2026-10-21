// Phosphor themes. Default (no attribute) is green; the toggle cycles through these.
export const THEMES = ["green", "amber", "paper"] as const;
export type Theme = (typeof THEMES)[number];

export function currentTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "green";
}

export function setTheme(t: Theme) {
  if (t === "green") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  try { localStorage.setItem("theme", t); } catch {}
  window.dispatchEvent(new Event("themechange"));
}

// Canvas code can't use CSS vars directly, so it reads them here and redraws on "themechange".
export function readColors() {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
  return {
    bg: v("--bg", "#0a0f0b"),
    fg: v("--fg", "#c6f5cc"),
    dim: v("--fg-dim", "#6c9873"),
    accent: v("--accent", "#5cff7a"),
    surface: v("--surface", "#0f1711"),
  };
}

export function onThemeChange(cb: () => void) {
  window.addEventListener("themechange", cb);
  return () => window.removeEventListener("themechange", cb);
}
