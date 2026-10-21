"use client";

import { useCallback, useEffect, useRef } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#%@01";

type Props = {
  text: string;
  as?: React.ElementType;
  className?: string;
  onReveal?: boolean;
  onHover?: boolean;
  duration?: number;
};

// Each character settles at its own random moment, cycling glyphs until then.
export default function Scramble({ text, as: Tag = "span", className, onReveal = true, onHover = true, duration = 900 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const run = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    const settle = Array.from(text, () => Math.random() * duration * 0.8 + duration * 0.2);
    const start = performance.now();
    const step = (now: number) => {
      const t = now - start;
      let out = "";
      let done = true;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || t >= settle[i]) out += ch;
        else {
          done = false;
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      el.textContent = out;
      if (!done) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }, [text, duration]);

  useEffect(() => {
    if (!onReveal || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(frame.current); };
  }, [onReveal, run]);

  return (
    <Tag ref={ref} className={className} aria-label={text} onMouseEnter={onHover ? run : undefined}>
      {text}
    </Tag>
  );
}
