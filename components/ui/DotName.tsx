"use client";

import { useEffect, useRef } from "react";
import { onThemeChange, readColors } from "@/lib/theme";

// The footer name as a dot-matrix field of drifting dots, with an occasional horizontal
// slice-glitch. Plain 2D canvas.
export default function DotName({ text }: { text: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let dots: { x: number; y: number; ox: number; oy: number; p: number }[] = [];
    let raf = 0, running = false, glitch = 0;
    let fg = readColors().accent;
    const offTheme = onThemeChange(() => { fg = readColors().accent; });
    const mouse = { x: -999, y: -999 };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      const off = document.createElement("canvas");
      off.width = canvas.width; off.height = canvas.height;
      const o = off.getContext("2d", { willReadFrequently: true })!;
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "monospace";
      let size = canvas.height * 0.9;
      o.font = `${size}px ${family}`;
      const w = o.measureText(text).width;
      if (w > canvas.width * 0.98) size *= (canvas.width * 0.98) / w;
      o.font = `${size}px ${family}`;
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      o.fillText(text, 0, canvas.height / 2);
      const data = o.getImageData(0, 0, off.width, off.height).data;
      const step = Math.max(4, Math.round(5 * dpr));
      dots = [];
      for (let y = 0; y < off.height; y += step)
        for (let x = 0; x < off.width; x += step)
          if (data[(y * off.width + x) * 4 + 3] > 128) dots.push({ x, y, ox: x, oy: y, p: Math.random() * 6.28 });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dpr = canvas.width / r.width;
      mouse.x = (e.clientX - r.left) * dpr; mouse.y = (e.clientY - r.top) * dpr;
    };
    window.addEventListener("pointermove", onMove);

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!running) return;
      const t = now / 1000;
      if (Math.random() < 0.006) glitch = 10;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = fg;
      const r = canvas.width / 400;
      for (const d of dots) {
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const push = dist < 80 * r ? (1 - dist / (80 * r)) * 30 * r : 0;
        const tx = d.ox + Math.sin(t + d.p) * 1.5 + (dx / (dist || 1)) * push;
        const ty = d.oy + Math.cos(t * 0.8 + d.p) * 1.5 + (dy / (dist || 1)) * push;
        d.x += (tx - d.x) * 0.12; d.y += (ty - d.y) * 0.12;
        const slice = glitch > 0 && Math.floor(d.oy / 18) % 3 === Math.floor(t * 20) % 3 ? (Math.random() - 0.5) * 40 : 0;
        ctx.fillRect(d.x + slice, d.y, r * 1.6, r * 1.6);
      }
      if (glitch > 0) glitch--;
    };
    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (running = e.isIntersecting));
    io.observe(canvas);
    return () => { offTheme(); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, [text]);

  return <canvas ref={ref} className="dot-name" aria-label={text} role="img" />;
}
