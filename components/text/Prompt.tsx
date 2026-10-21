"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { onArrive } from "@/lib/intro";
import { profile } from "@/lib/content";

type Props = {
  cmd: string;
  path?: string;
  className?: string;
  // "view" types when scrolled into view; "arrive" types after the boot screen / page switch.
  start?: "view" | "arrive";
  onDone?: () => void;
};

// A shell prompt whose command types itself out the first time it scrolls into view.
export default function Prompt({ cmd, path = "~", className, start = "view", onDone }: Props) {
  const out = useRef<HTMLSpanElement>(null);
  const done = useRef(onDone);
  useEffect(() => { done.current = onDone; }, [onDone]);

  useEffect(() => {
    const el = out.current!;
    if (prefersReducedMotion()) { done.current?.(); return; }
    el.textContent = "";
    let timer = 0;
    let i = 0;
    const type = () => {
      el.textContent = cmd.slice(0, ++i);
      if (i < cmd.length) timer = window.setTimeout(type, 28 + Math.random() * 45);
      else done.current?.();
    };
    if (start === "arrive") {
      const off = onArrive(() => { timer = window.setTimeout(type, 150); });
      return () => { off(); clearTimeout(timer); };
    }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = window.setTimeout(type, 200);
    }, { threshold: 1 });
    io.observe(el.parentElement!);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [cmd, start]);

  return (
    <p className={`prompt ${className ?? ""}`}>
      <span className="ps1">{profile.user}@{profile.host}:{path}$</span>{" "}
      <span ref={out} className="cmd">{cmd}</span>
      <span className="caret" aria-hidden />
    </p>
  );
}
