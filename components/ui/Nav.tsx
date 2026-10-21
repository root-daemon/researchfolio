"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import TLink from "@/components/ui/TLink";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { profile } from "@/lib/content";

const items = [
  { id: "top", label: "home" },
  { id: "about", label: "about" },
  { id: "work", label: "projects" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
];

// A tmux status line: numbered windows (the current section gets a *), the theme, and a clock.
export default function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState("top");
  const clock = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach((it) => { const el = document.getElementById(it.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => { clock.current!.textContent = `${fmt.format(new Date())} IST`; };
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  const current = pathname === "/" ? active : "work";
  return (
    <header className="nav">
      <TLink href="/#top" id="nav-logo" className="nav-logo" aria-label="Home">[{profile.user}]</TLink>
      <nav className="nav-links">
        {items.map((it, i) => (
          <TLink key={it.id} href={`/#${it.id}`} className={`nav-link ${current === it.id ? "is-active" : ""}`}>
            {i}<span className="nav-label">:{it.label}</span>{current === it.id ? "*" : ""}
          </TLink>
        ))}
      </nav>
      <div className="nav-right">
        <ThemeToggle />
        <span ref={clock} className="nav-clock">--:-- IST</span>
      </div>
    </header>
  );
}
