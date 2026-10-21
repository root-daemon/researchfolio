"use client";

import { useEffect } from "react";

// The preloader fires "intro:done" once; page transitions fire "page:enter".
// Anything that animates on arrival waits for whichever comes first for this mount.
export function onArrive(cb: () => void) {
  const w = window as unknown as { __introDone?: boolean };
  if (w.__introDone) {
    // Mounted by a page transition (or after the intro) — wait for the page to settle in.
    const t = setTimeout(cb, 380);
    return () => clearTimeout(t);
  }
  const handler = () => cb();
  window.addEventListener("intro:done", handler, { once: true });
  return () => window.removeEventListener("intro:done", handler);
}

export function useArrive(cb: () => void, deps: React.DependencyList = []) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onArrive(cb), deps);
}
