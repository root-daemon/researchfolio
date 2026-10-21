"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

// Lenis drives the page, GSAP's ticker drives Lenis, ScrollTrigger listens to Lenis.
// After the wheel goes quiet, we gently snap to the nearest [data-snap] section.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    l.on("scroll", ScrollTrigger.update);
    // Lenis is an external instance created on mount; expose it to consumers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(l);
    (window as unknown as { __lenis: Lenis }).__lenis = l;

    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-snap]"));
        const y = window.scrollY;
        let best: HTMLElement | null = null;
        let bestDist = window.innerHeight * 0.18; // only snap when we're already close
        for (const t of targets) {
          const d = Math.abs(t.getBoundingClientRect().top);
          if (d < bestDist) { bestDist = d; best = t; }
        }
        if (best && bestDist > 2) l.scrollTo(y + best.getBoundingClientRect().top, { duration: 1.2 });
      }, 1400);
    };
    l.on("scroll", onScroll);

    return () => {
      clearTimeout(idle);
      gsap.ticker.remove(raf);
      l.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
