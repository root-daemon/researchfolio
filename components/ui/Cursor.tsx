"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Gap between the crosshair arms per context ([data-cursor] or any link/button).
const SPREAD: Record<string, number> = { "": 4, link: 9, view: 12, aim: 2 };

// A shooter-style crosshair that spreads over links, shows a label on [data-cursor-label]
// and pulls [data-magnetic] elements toward the pointer. Desktop pointers only.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = dot.current!;
    document.documentElement.classList.add("has-cursor");
    const xTo = gsap.quickTo(el, "x", { duration: 0.12, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.12, ease: "power3" });
    let mode: string | null = null;

    const setMode = (m: string, text = "") => {
      if (m === mode) return;
      mode = m;
      gsap.to(el, { "--gap": `${SPREAD[m] ?? SPREAD.link}px`, duration: 0.25, ease: "power3" });
      label.current!.textContent = text;
      gsap.to(label.current, { opacity: text ? 1 : 0, duration: 0.2 });
    };

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, input");
      const m = target?.dataset.cursor ?? (target ? "link" : "");
      setMode(m, target?.dataset.cursorLabel ?? "");
    };
    const down = () => gsap.fromTo(el, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    // Magnetic buttons: pull toward the pointer, spring back elastically.
    const magnets = new Map<HTMLElement, (e: PointerEvent) => void>();
    const leave = (e: Event) => gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    const bindMagnets = () => {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((m) => {
        if (magnets.has(m)) return;
        const fn = (e: PointerEvent) => {
          const r = m.getBoundingClientRect();
          gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.4, ease: "power3" });
        };
        magnets.set(m, fn);
        m.addEventListener("pointermove", fn);
        m.addEventListener("pointerleave", leave);
      });
    };
    bindMagnets();
    const mo = new MutationObserver(bindMagnets);
    mo.observe(document.body, { childList: true, subtree: true });

    setMode("");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      mo.disconnect();
      magnets.forEach((fn, m) => { m.removeEventListener("pointermove", fn); m.removeEventListener("pointerleave", leave); });
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={dot} className="cursor" aria-hidden>
      <i /><i /><i /><i />
      <span ref={label} className="cursor-label" />
    </div>
  );
}
