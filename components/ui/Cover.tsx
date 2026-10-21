"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { drawCover } from "@/lib/cover";
import { onThemeChange, readColors } from "@/lib/theme";

const RAMP = "@%#*+=-:. ";

// Procedural project cover in the current phosphor colour. It starts as ASCII
// and dissolves cell by cell (in a random order) into the image underneath.
export default function Cover({ seed, className, play = "view" }: { seed: string; className?: string; play?: "view" | "mount" }) {
  const img = useRef<HTMLCanvasElement>(null);
  const ascii = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = img.current!;
    const a = ascii.current!;
    const ctx = a.getContext("2d")!;
    const cell = 14;
    const state = { reveal: 1 };
    let render = () => {};

    const paint = () => {
      const { accent, surface } = readColors();
      const src = drawCover(seed, [accent, surface]);
      c.width = a.width = src.width;
      c.height = a.height = src.height;
      c.getContext("2d")!.drawImage(src, 0, 0);
      const cols = Math.ceil(a.width / cell), rows = Math.ceil(a.height / cell);
      // Sample brightness per cell once.
      const data = src.getContext("2d")!.getImageData(0, 0, src.width, src.height).data;
      const cells = Array.from({ length: cols * rows }, (_, i) => {
        const x = (i % cols) * cell, y = Math.floor(i / cols) * cell;
        const p = (Math.min(y + 7, a.height - 1) * a.width + Math.min(x + 7, a.width - 1)) * 4;
        const lum = (data[p] * 0.3 + data[p + 1] * 0.59 + data[p + 2] * 0.11) / 255;
        return { x, y, ch: RAMP[Math.floor((1 - lum) * (RAMP.length - 1))], t: Math.random() };
      });
      render = () => {
        ctx.clearRect(0, 0, a.width, a.height);
        ctx.font = `${cell}px ui-monospace, monospace`;
        ctx.textBaseline = "top";
        for (const k of cells) {
          if (k.t > state.reveal) continue;
          ctx.fillStyle = surface;
          ctx.fillRect(k.x, k.y, cell, cell);
          ctx.fillStyle = accent;
          ctx.fillText(k.ch, k.x + 2, k.y);
        }
      };
      render();
    };
    paint();
    const offTheme = onThemeChange(paint);

    const tween = gsap.to(state, {
      reveal: 0,
      duration: play === "mount" ? 0.8 : 1.6,
      ease: "power2.inOut",
      onUpdate: () => render(),
      scrollTrigger: play === "view" ? { trigger: c, start: "top 85%", once: true } : undefined,
    });
    return () => { offTheme(); tween.scrollTrigger?.kill(); tween.kill(); };
  }, [seed, play]);

  return (
    <div className={`cover ${className ?? ""}`}>
      <canvas ref={img} className="cover-img" aria-hidden />
      <canvas ref={ascii} className="cover-ascii" aria-hidden />
    </div>
  );
}
