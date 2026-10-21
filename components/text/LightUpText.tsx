"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Characters start dim; a scrubbed, soft-edged front lights them up as you scroll.
// Words wrapped in *asterisks* get the accent highlight.
export default function LightUpText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const chars = ref.current!.querySelectorAll(".lu-char");
    const tween = gsap.fromTo(
      chars,
      { opacity: 0.12 },
      {
        opacity: 1,
        ease: "none",
        stagger: { each: 0.02 },
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
                <span key={wi} className="lu-word">
                  {Array.from(w).map((c, ci) => <span key={ci} className="lu-char">{c}</span>)}
                </span>
              ),
            )}
          </span>
        );
      })}
    </p>
  );
}
