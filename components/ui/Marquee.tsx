"use client";

import { useEffect, useRef } from "react";
import { gsap, Draggable } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";

// Endless ticker. Scroll speed boosts it (in the scroll direction), and you can
// grab and fling it — the throw coasts with inertia before it settles back.
export default function Marquee({ items }: { items: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const boost = useRef(0);

  useEffect(() => {
    const el = track.current!;
    const half = () => el.scrollWidth / 2;
    const dir = -1;
    let x = 0;
    const wrap = gsap.utils.wrap(-half(), 0);
    const tick = (_: number, dt: number) => {
      boost.current *= 0.92;
      x = wrap(x + dir * (0.05 + Math.abs(boost.current)) * dt);
      gsap.set(el, { x });
    };
    gsap.ticker.add(tick);

    const proxy = document.createElement("div");
    let lastX = 0;
    const [drag] = Draggable.create(proxy, {
      type: "x",
      trigger: el,
      inertia: true,
      onPress() { lastX = this.x; },
      onDrag() { x = wrap(x + (this.x - lastX)); lastX = this.x; },
      onThrowUpdate() { x = wrap(x + (this.x - lastX)); lastX = this.x; },
    });
    return () => { gsap.ticker.remove(tick); drag.kill(); };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ velocity }: { velocity: number }) => {
      boost.current = gsap.utils.clamp(-0.6, 0.6, velocity * 0.02);
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const row = items.map((s, i) => <span key={i} className="marquee-item">{s}<i aria-hidden /></span>);
  return (
    <div className="marquee" data-cursor="big">
      <div ref={track} className="marquee-track">{row}{row}</div>
    </div>
  );
}
