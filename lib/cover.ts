import { projects } from "@/lib/content";

// Procedural cover art: every project gets an original generative image
// drawn from its pattern and ground colours, so no external media is needed.

const cache = new Map<string, HTMLCanvasElement>();

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function drawCover(seed: string, [a, b]: [string, string], w = 640, h = 400) {
  const key = `${seed}-${a}-${b}-${w}x${h}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const rand = hash(seed);
  ctx.fillStyle = b;
  ctx.fillRect(0, 0, w, h);

  // A couple of faint glows in the pattern colour so the ground isn't flat.
  for (let i = 0; i < 2; i++) {
    const x = rand() * w, y = rand() * h, r = (0.4 + rand() * 0.4) * w;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, a);
    g.addColorStop(1, b);
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.globalAlpha = 1;
  // A big geometric mark in the pattern colour: rings, bars, grid or waves.
  // Projects cycle through them in list order so neighbours never repeat.
  ctx.strokeStyle = a;
  ctx.fillStyle = a;
  const index = projects.findIndex((p) => p.slug === seed);
  const mode = index >= 0 ? index % 4 : Math.floor(rand() * 4);
  const cx = w * (0.35 + rand() * 0.3), cy = h * (0.35 + rand() * 0.3);
  if (mode === 0) {
    for (let i = 1; i < 9; i++) {
      ctx.globalAlpha = 1 - i * 0.09;
      ctx.lineWidth = 1 + i * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, i * h * 0.06, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (mode === 1) {
    for (let i = 0; i < 14; i++) {
      ctx.globalAlpha = 0.35 + rand() * 0.65;
      ctx.fillRect(i * (w / 14), cy - (rand() * h) / 2, w / 40, rand() * h * 0.8);
    }
  } else if (mode === 3) {
    for (let i = 0; i < 9; i++) {
      const y0 = h * (0.15 + i * 0.09), amp = h * (0.03 + rand() * 0.07), f = 1.5 + rand() * 2;
      ctx.globalAlpha = 0.3 + (i / 9) * 0.7;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 8) ctx.lineTo(x, y0 + Math.sin((x / w) * Math.PI * f + i * 0.6) * amp);
      ctx.stroke();
    }
  } else {
    const s = h / 10;
    for (let x = 0; x < w; x += s)
      for (let y = 0; y < h; y += s) {
        const r = rand();
        if (r > 0.62) {
          ctx.globalAlpha = 0.25 + (r - 0.62) * 2;
          ctx.fillRect(x + s * 0.2, y + s * 0.2, s * 0.6, s * 0.6);
        }
      }
  }
  ctx.globalAlpha = 1;
  cache.set(key, c);
  return c;
}
