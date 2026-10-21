"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { profile, projects } from "@/lib/content";

// The boot log, printed one line at a time. "|" splits a line into label and status.
const BOOT = [
  "SV-BIOS v2.6  (C) 2003-2026",
  "Checking CPU|OK",
  "Memory test: 640K OK",
  "",
  `Detecting drives... ${projects.filter((p) => p.featured).map((p) => p.slug).join(" ")}`,
  "Loading kernel|OK",
  `Mounting /home/${profile.user}|OK`,
  "Starting network|OK",
  "Starting display server|OK",
  "",
  `${profile.host} login: ${profile.user}`,
];

// Prints the boot log, then the screen "switches on" (a bright line opens to full
// height) and reveals the page. Any key or click skips it.
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLPreElement>(null);
  // Unmount via state — never detach React-owned nodes by hand.
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const w = window as unknown as { __introDone?: boolean };
    const finish = () => {
      w.__introDone = true;
      document.documentElement.classList.remove("is-loading");
      window.dispatchEvent(new Event("intro:done"));
    };
    // Boot once per browser session: reloads and return visits go straight to the page.
    let booted = false;
    try { booted = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch {}
    if (w.__introDone || booted || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGone(true);
      return;
    }

    const el = log.current!;
    const ready = Promise.all([
      document.fonts.ready,
      new Promise((r) => (document.readyState === "complete" ? r(0) : addEventListener("load", r, { once: true }))),
    ]);
    let ended = false;
    const tl = gsap.timeline({ paused: true, onComplete: () => setGone(true) });
    const end = () => {
      if (ended) return;
      ended = true;
      ready.then(() => tl.play());
    };
    tl.to(".pre-screen", { scaleY: 0.004, duration: 0.25, ease: "power2.in" })
      .to(".pre-screen", { scaleX: 0, duration: 0.18, ease: "power2.in" })
      .add(finish)
      .to(root.current, { opacity: 0, duration: 0.35 });

    // Print lines on a timer; statuses get dot leaders to a fixed column.
    let i = 0;
    let timer = 0;
    const next = () => {
      if (i >= BOOT.length) { timer = window.setTimeout(end, 350); return; }
      const [label, status] = BOOT[i++].split("|");
      const line = document.createElement("span");
      line.className = "pre-line";
      if (status) {
        line.textContent = `${label} ${".".repeat(Math.max(3, 30 - label.length))} `;
        const s = document.createElement("b");
        s.textContent = `[ ${status} ]`;
        line.appendChild(s);
      } else line.textContent = label || " ";
      el.appendChild(line);
      timer = window.setTimeout(next, status ? 70 + Math.random() * 90 : 110);
    };
    timer = window.setTimeout(next, 150);

    const skip = () => { clearTimeout(timer); end(); };
    addEventListener("keydown", skip, { once: true });
    addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(timer);
      tl.kill();
      removeEventListener("keydown", skip);
      removeEventListener("pointerdown", skip);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="preloader" aria-hidden>
      <div className="pre-screen">
        <pre ref={log} className="pre-log" />
        <span className="pre-hint">press any key to skip</span>
      </div>
    </div>
  );
}
