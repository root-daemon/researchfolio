"use client";

import { useEffect, useRef } from "react";
import { onThemeChange, readColors } from "@/lib/theme";

const RAMP = " .·:-=+*x#%@";

// A 2D-canvas "plasma" of characters: four summed sine waves mapped onto a
// character ramp, brightened in a soft ring around the cursor. Cheap: no WebGL.
export default function AsciiField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const cell = 16;
    let cols = 0, rows = 0, raf = 0, running = true;
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    let { dim: color, accent } = readColors();
    const offTheme = onThemeChange(() => ({ dim: color, accent } = readColors()));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      cols = Math.ceil(r.width / cell);
      rows = Math.ceil(r.height / cell);
      ctx.font = `12px ui-monospace, monospace`;
      ctx.textBaseline = "top";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / cell;
      mouse.ty = (e.clientY - r.top) / cell;
    };
    window.addEventListener("pointermove", onMove);

    let last = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (!running || now - last < 33) return; // ~30fps is plenty for text
      last = now;
      const t = now / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let v =
            Math.sin(x * 0.11 + t * 0.7) +
            Math.sin(y * 0.17 - t * 0.5) +
            Math.sin((x + y) * 0.07 + t * 0.4) +
            Math.sin(Math.hypot(x - cols / 2, y - rows / 2) * 0.16 - t);
          v = (v + 4) / 8;
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          const ring = Math.max(0, 1 - Math.abs(d - 5 - Math.sin(t * 3) * 1.5) / 3);
          v = Math.min(1, v * 0.55 + ring * 0.6);
          const ch = RAMP[Math.floor(v * (RAMP.length - 1))];
          if (ch === " ") continue;
          ctx.fillStyle = ring > 0.35 ? accent : color;
          ctx.globalAlpha = 0.25 + v * 0.6;
          ctx.fillText(ch, x * cell, y * cell);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (running = e.isIntersecting));
    io.observe(canvas);
    return () => { offTheme(); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", onMove); };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
