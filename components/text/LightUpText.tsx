"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Words start dim; a scrubbed, soft-edged front lights them up as you scroll.
// (Per word, not per letter: a fifth of the nodes and tweens for the same effect.)
// Words wrapped in *asterisks* get the accent highlight.
export default function LightUpText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const words = ref.current!.querySelectorAll(".lu-word");
    const tween = gsap.fromTo(
      words,
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: "none",
        stagger: { each: 0.1 },
        scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
      },
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [text]);

  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <p ref={ref} className={className} aria-label={text.replaceAll("*", "")}>
      {parts.map((part, pi) => {
        const hl = part.startsWith("*");
        const words = (hl ? part.slice(1, -1) : part).split(/(\s+)/);
        return (
          <span key={pi} className={hl ? "hl" : undefined} aria-hidden>
            {words.map((w, wi) =>
              /^\s+$/.test(w) ? " " : (
                <span key={wi} className="lu-word">{w}</span>
              ),
            )}
          </span>
        );
      })}
    </p>
  );
}
