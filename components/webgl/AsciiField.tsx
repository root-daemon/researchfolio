"use client";

import { useEffect, useRef } from "react";
import { onArrive } from "@/lib/intro";
import { prefersReducedMotion } from "@/lib/gsap";
import { onThemeChange, readColors } from "@/lib/theme";

const RAMP = " .·:-=+*x#%@";
const CELL = 16;
const FRAME_MS = 1000 / 24; // 24fps is plenty for drifting text

// A 2D-canvas "plasma" of characters: four summed sine waves mapped onto a
// character ramp, brightened in a soft ring around the cursor.
// Kept cheap: glyphs are pre-rendered once into a sprite strip (one drawImage per
// cell, no per-cell font/colour/alpha changes), the row/column/diagonal waves are
// computed once per line instead of per cell, and the radial term is cached on resize.
export default function AsciiField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let cols = 0, rows = 0, raf = 0, visible = true, started = false;
    let radial = new Float32Array(0), colWave = new Float32Array(0), rowWave = new Float32Array(0), diag = new Float32Array(0);
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Sprite strip: row 0 = dim glyphs, row 1 = accent glyphs, alpha baked in per ramp step.
    const sprite = document.createElement("canvas");
    const buildSprite = () => {
      const { dim, accent } = readColors();
      sprite.width = CELL * RAMP.length;
      sprite.height = CELL * 2;
      const s = sprite.getContext("2d")!;
      s.font = "12px ui-monospace, monospace";
      s.textBaseline = "top";
      [dim, accent].forEach((c, row) => {
        s.fillStyle = c;
        for (let i = 1; i < RAMP.length; i++) {
          s.globalAlpha = 0.25 + (i / (RAMP.length - 1)) * 0.6;
          s.fillText(RAMP[i], i * CELL, row * CELL);
        }
      });
    };
    buildSprite();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width;
      canvas.height = r.height;
      cols = Math.ceil(r.width / CELL);
      rows = Math.ceil(r.height / CELL);
      radial = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) radial[y * cols + x] = Math.hypot(x - cols / 2, y - rows / 2) * 0.16;
      colWave = new Float32Array(cols);
      rowWave = new Float32Array(rows);
      diag = new Float32Array(cols + rows);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / CELL;
      mouse.ty = (e.clientY - r.top) / CELL;
    };
    if (finePointer) window.addEventListener("pointermove", onMove);

    const top = RAMP.length - 1;
    const render = (now: number) => {
      const t = now / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.15;
      mouse.y += (mouse.ty - mouse.y) * 0.15;
      for (let x = 0; x < cols; x++) colWave[x] = Math.sin(x * 0.11 + t * 0.7);
      for (let y = 0; y < rows; y++) rowWave[y] = Math.sin(y * 0.17 - t * 0.5);
      for (let k = 0; k < cols + rows; k++) diag[k] = Math.sin(k * 0.07 + t * 0.4);
      const ringR = 5 + Math.sin(t * 3) * 1.5;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let y = 0; y < rows; y++) {
        const dy = y - mouse.y;
        for (let x = 0; x < cols; x++) {
          let v = (colWave[x] + rowWave[y] + diag[x + y] + Math.sin(radial[y * cols + x] - t) + 4) / 8;
          let ring = 0;
          const dx = x - mouse.x;
          // Only cells near the pointer can be in the ring; skip the sqrt for the rest.
          if (dx * dx + dy * dy < 100) ring = Math.max(0, 1 - Math.abs(Math.sqrt(dx * dx + dy * dy) - ringR) / 3);
          v = Math.min(1, v * 0.55 + ring * 0.6);
          const i = Math.floor(v * top);
          if (i === 0) continue;
          ctx.drawImage(sprite, i * CELL, ring > 0.35 ? CELL : 0, CELL, CELL, x * CELL, y * CELL, CELL, CELL);
        }
      }
    };

    let last = 0;
    const offTheme = onThemeChange(() => { buildSprite(); render(last); });
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      render(now);
    };
    const play = () => { cancelAnimationFrame(raf); if (visible && started) raf = requestAnimationFrame(loop); };

    // Static frame under the boot screen and for reduced motion; animate only once the
    // page has arrived and only while the canvas is on screen.
    render(0);
    const offArrive = prefersReducedMotion() ? () => {} : onArrive(() => { started = true; play(); });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; play(); });
    io.observe(canvas);
    return () => {
      offTheme(); offArrive(); cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
