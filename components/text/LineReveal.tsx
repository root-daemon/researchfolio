"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { onArrive } from "@/lib/intro";

type Props = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  // "arrive" plays after the intro/page transition; "scroll" plays when scrolled into view.
  trigger?: "arrive" | "scroll";
  delay?: number;
};

// Lines slide up out of clipped masks.
export default function LineReveal({ children, as: Tag = "div", className, trigger = "scroll", delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current!;
    let split: SplitText | null = null;
    let cleanup = () => {};
    document.fonts.ready.then(() => {
      split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
      gsap.set(split.lines, { yPercent: 110 });
      el.style.visibility = "visible";
      const play = () => gsap.to(split!.lines, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay });
      if (trigger === "arrive") cleanup = onArrive(play);
      else {
        const tween = gsap.to(split.lines, {
          yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, delay,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        cleanup = () => tween.scrollTrigger?.kill();
      }
    });
    return () => { cleanup(); split?.revert(); };
  }, [trigger, delay]);

  return (
    <Tag ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </Tag>
  );
}
