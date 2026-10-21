"use client";

import { useEffect, useRef, useState } from "react";

const ROUNDS = 15;
const KEY = "aim-best";

type Phase = "idle" | "live" | "done";
type Result = { avg: number; acc: number };

// Click the targets as fast as you can. Average time per target and accuracy are
// scored; your best average is kept in localStorage.
export default function AimTrainer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState({ x: 50, y: 50, n: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const shown = useRef(0);
  const times = useRef<number[]>([]);
  const misses = useRef(0);

  useEffect(() => {
    const b = Number(localStorage.getItem(KEY));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (b) setBest(b);
  }, []);

  const spawn = (n: number) => {
    setTarget({ x: 8 + Math.random() * 84, y: 12 + Math.random() * 76, n });
    shown.current = performance.now();
  };

  const start = () => {
    times.current = [];
    misses.current = 0;
    setResult(null);
    setPhase("live");
    spawn(1);
  };

  const hit = (e: React.MouseEvent) => {
    e.stopPropagation();
    times.current.push(performance.now() - shown.current);
    if (target.n < ROUNDS) return spawn(target.n + 1);
    const avg = Math.round(times.current.reduce((a, b) => a + b, 0) / times.current.length);
    const acc = Math.round((ROUNDS / (ROUNDS + misses.current)) * 100);
    setResult({ avg, acc });
    setPhase("done");
    if (!best || avg < best) {
      setBest(avg);
      localStorage.setItem(KEY, String(avg));
    }
  };

  const rank = (ms: number) => (ms < 450 ? "cracked" : ms < 600 ? "solid" : ms < 800 ? "warming up" : "bot difficulty");

  return (
    <div className="aim" data-cursor="aim" onPointerDown={() => phase === "live" && misses.current++}>
      <div className="aim-hud">
        <span>{phase === "live" ? `target ${target.n}/${ROUNDS}` : `${ROUNDS} targets`}</span>
        <span>best {best ? `${best} ms` : "--"}</span>
      </div>
      {phase === "live" && (
        <button
          key={target.n}
          className="aim-target"
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={hit}
          aria-label={`Target ${target.n}`}
        />
      )}
      {phase !== "live" && (
        <div className="aim-screen">
          {result ? (
            <pre className="aim-result">
{`avg time   ${result.avg} ms
accuracy   ${result.acc}%
rating     ${rank(result.avg)}`}
            </pre>
          ) : (
            <p className="aim-intro">Click {ROUNDS} targets as fast as you can.</p>
          )}
          <button className="key key--main" onClick={start}>{result ? "▶ again" : "▶ start"}</button>
        </div>
      )}
    </div>
  );
}
