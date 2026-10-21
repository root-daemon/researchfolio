"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";
import SectionHead from "@/components/text/SectionHead";
import Prompt from "@/components/text/Prompt";
import Scramble from "@/components/text/Scramble";
import TLink from "@/components/ui/TLink";
import Cover from "@/components/ui/Cover";
import { projects } from "@/lib/content";

export default function Work() {
  const grid = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  // Tilt the grid with scroll velocity, easing back when you stop.
  useEffect(() => {
    if (!lenis) return;
    const rot = gsap.quickTo(grid.current, "rotationX", { duration: 0.6, ease: "power3" });
    const skew = gsap.quickTo(grid.current, "skewY", { duration: 0.6, ease: "power3" });
    const onScroll = ({ velocity }: { velocity: number }) => {
      const v = gsap.utils.clamp(-3, 3, velocity * 0.12);
      rot(-v * 1.5);
      skew(v * 0.5);
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <section id="work" className="section work" data-snap>
      <SectionHead cmd="ls ~/projects" title="Projects" />
      <div ref={grid} className="featured">
        {featured.map((p) => (
          <TLink key={p.slug} href={`/work/${p.slug}`} className="feat win" data-cursor="view" data-cursor-label="open">
            <div className="win-bar"><span>{p.slug}/</span><span>{p.kind} · {p.year}</span></div>
            <Cover seed={p.slug} />
            <div className="feat-meta">
              <span className="feat-title">{p.title}</span>
              <p className="feat-blurb">{p.blurb}</p>
            </div>
          </TLink>
        ))}
      </div>

      <Prompt cmd="ls -l ~/projects/more" className="block-prompt" />
      <RowPreview>
        {(show) => (
          <ul className="project-list">
            {rest.map((p) => (
              <li key={p.slug}>
                <TLink href={`/work/${p.slug}`} className="project-row" data-cursor="link" onMouseEnter={() => show(p.slug)}>
                  <span className="row-perm" aria-hidden>drwxr-xr-x</span>
                  <span className="row-year">{p.year}</span>
                  <span className="row-title"><Scramble text={`${p.slug}/`} onReveal={false} /></span>
                  <span className="row-blurb">{p.blurb}</span>
                </TLink>
              </li>
            ))}
          </ul>
        )}
      </RowPreview>
    </section>
  );
}

// Hovering a row opens a small window with that project's cover, following the pointer.
function RowPreview({ children }: { children: (show: (slug: string) => void) => React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = box.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => { x(e.clientX + 24); y(e.clientY - 90); };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div onMouseLeave={() => setSlug(null)}>
      {children(setSlug)}
      <div ref={box} className={`row-preview win ${slug ? "is-on" : ""}`} aria-hidden>
        {slug && (
          <>
            <div className="win-bar"><span>preview</span><span>{slug}</span></div>
            <Cover key={slug} seed={slug} play="mount" />
          </>
        )}
      </div>
    </div>
  );
}
