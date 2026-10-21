"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

// Types a word, holds it, backspaces it, types the next. Like someone at a terminal.
export default function RotatingWord({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (prefersReducedMotion()) return;
    let w = 0, i = words[0].length, dir = -1, timer = 0;
    const tick = () => {
      const word = words[w];
      i += dir;
      el.textContent = word.slice(0, i);
      let wait = dir > 0 ? 70 : 35;
      if (dir > 0 && i === word.length) { dir = -1; wait = 1800; }
      else if (dir < 0 && i === 0) { dir = 1; w = (w + 1) % words.length; wait = 300; }
      timer = window.setTimeout(tick, wait);
    };
    timer = window.setTimeout(tick, 2600);
    return () => clearTimeout(timer);
  }, [words]);

  return <span ref={ref} className="rw">{words[0]}</span>;
}
