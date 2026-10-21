"use client";

import { useEffect, useRef, useState } from "react";
import { synth, TRACKS } from "@/lib/synth";
import { onThemeChange, readColors } from "@/lib/theme";

// A cassette that plays the synth's generated tracks, with an oscilloscope
// reading the live waveform underneath. Nothing plays until you press play.
export default function TapeDeck() {
  const [state, setState] = useState(synth.state);
  const scope = useRef<HTMLCanvasElement>(null);

  useEffect(() => synth.subscribe(setState), []);

  useEffect(() => {
    const c = scope.current!;
    const ctx = c.getContext("2d")!;
    let { accent, dim } = readColors();
    const offTheme = onThemeChange(() => ({ accent, dim } = readColors()));
    const buf = new Uint8Array(1024);
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const w = (c.width = c.clientWidth * 2), h = (c.height = c.clientHeight * 2);
      ctx.strokeStyle = dim;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += w / 12) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y <= h; y += h / 4) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 3;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      const live = synth.analyser && synth.state.playing;
      if (live) synth.analyser!.getByteTimeDomainData(buf);
      for (let i = 0; i < buf.length; i++) {
        const v = live ? Math.max(-1, Math.min(1, ((buf[i] - 128) / 128) * 3)) : 0;
        const x = (i / (buf.length - 1)) * w, y = h / 2 + v * h * 0.42;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) draw();
    });
    io.observe(c);
    return () => { offTheme(); io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const track = TRACKS[state.track];
  return (
    <div className={`deck ${state.playing ? "is-playing" : ""}`}>
      <div className="tape" aria-hidden>
        <div className="tape-label">
          <span>SIDE A</span>
          <span className="tape-title">{track.name}</span>
          <span>{track.bpm} BPM</span>
        </div>
        <div className="tape-window">
          <Reel />
          <div className="tape-ribbon" />
          <Reel />
        </div>
      </div>
      <canvas ref={scope} className="scope" aria-hidden />
      <div className="deck-controls">
        <button className="key" onClick={() => synth.skip(-1)} aria-label="Previous track">|◀</button>
        <button className="key key--main" onClick={() => synth.toggle()} aria-label={state.playing ? "Pause" : "Play"}>
          {state.playing ? "❚❚ pause" : "▶ play"}
        </button>
        <button className="key" onClick={() => synth.skip(1)} aria-label="Next track">▶|</button>
      </div>
      <ol className="tracklist">
        {TRACKS.map((t, i) => (
          <li key={t.name}>
            <button className={i === state.track ? "is-current" : ""} onClick={() => synth.play(i)}>
              {String(i + 1).padStart(2, "0")} {t.name}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Reel() {
  return (
    <svg className="reel" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" />
      <circle cx="20" cy="20" r="6" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <rect key={a} x="19" y="4" width="2" height="7" transform={`rotate(${a} 20 20)`} />
      ))}
    </svg>
  );
}
