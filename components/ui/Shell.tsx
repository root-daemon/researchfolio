"use client";

import { useEffect, useRef, useState } from "react";
import { useTransitionNavigate } from "@/components/providers/PageTransition";
import { profile, projects } from "@/lib/content";
import { synth, TRACKS } from "@/lib/synth";
import { setTheme, THEMES, type Theme } from "@/lib/theme";

type Line = { kind: "in" | "out" | "err"; text: string };

const HELP = [
  "commands:",
  ...[
    ["whoami", "who this is"],
    ["ls", "list projects"],
    ["open <project>", "open a project page"],
    ["mail", "write me an email"],
    ["github, linkedin", "open my profiles"],
    [`play [1-${TRACKS.length}]`, "play a track on the tape deck"],
    ["pause, next", "control the tape deck"],
    [`theme <${THEMES.join("|")}>`, "change the phosphor"],
    ["clear", "clear the screen"],
  ].map(([c, d]) => `  ${c.padEnd(26)}${d}`),
].join("\n");

const NAMES = ["help", "whoami", "ls", "open", "mail", "github", "linkedin", "play", "pause", "next", "theme", "clear"];

// A small fake shell. Everything it can do is also reachable with normal links.
export default function Shell() {
  const navigate = useTransitionNavigate();
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: 'type "help" to see what works' }]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => {
    screen.current!.scrollTop = screen.current!.scrollHeight;
  }, [lines]);

  const run = (raw: string): Line[] => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const out = (text: string): Line[] => [{ kind: "out", text }];
    const link = (label: string) => profile.links.find((l) => l.label === label)!.href;
    switch (cmd) {
      case "": return [];
      case "help": return out(HELP);
      case "whoami": return out(`${profile.name}\n${profile.role} at ${profile.company}, ${profile.location}`);
      case "ls": return out(projects.map((p) => `${p.slug}/`).join("  "));
      case "open": {
        const p = projects.find((x) => x.slug === args[0]?.replace(/\/$/, ""));
        if (!p) return [{ kind: "err", text: `open: no such project: ${args[0] ?? ""}  (try "ls")` }];
        navigate(`/work/${p.slug}`);
        return out(`opening ${p.slug}...`);
      }
      case "mail":
        window.location.href = `mailto:${profile.email}`;
        return out(profile.email);
      case "github":
      case "linkedin": {
        const href = link(cmd === "github" ? "GitHub" : "LinkedIn");
        window.open(href, "_blank", "noopener");
        return out(href);
      }
      case "play": {
        const n = Number(args[0]);
        synth.play(n >= 1 && n <= TRACKS.length ? n - 1 : synth.state.track);
        return out(`now playing: ${TRACKS[synth.state.track].name}`);
      }
      case "pause": synth.stop(); return out("paused");
      case "next": synth.skip(1); return out(`now playing: ${TRACKS[synth.state.track].name}`);
      case "theme": {
        const t = args[0] as Theme;
        if (!THEMES.includes(t)) return [{ kind: "err", text: `usage: theme <${THEMES.join("|")}>` }];
        setTheme(t);
        return out(`phosphor set to ${t}`);
      }
      case "sudo": return [{ kind: "err", text: `${profile.user} is not in the sudoers file. This incident will be reported.` }];
      case "exit": return out("there is no exit. try \"mail\" instead.");
      default: return [{ kind: "err", text: `command not found: ${cmd}` }];
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = value;
    setValue("");
    if (cmd.trim()) history.current.push(cmd);
    cursor.current = history.current.length;
    if (cmd.trim() === "clear") return setLines([]);
    const result = run(cmd);
    setLines((l) => [...l, { kind: "in", text: cmd }, ...result]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === "ArrowUp" && h.length) {
      e.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(h[cursor.current]);
    } else if (e.key === "ArrowDown" && h.length) {
      e.preventDefault();
      cursor.current = Math.min(h.length, cursor.current + 1);
      setValue(h[cursor.current] ?? "");
    } else if (e.key === "Tab" && value) {
      // Complete command names, or project names after "open".
      const parts = value.split(" ");
      const pool = parts.length > 1 && parts[0] === "open" ? projects.map((p) => p.slug) : NAMES;
      const hit = pool.find((n) => n.startsWith(parts[parts.length - 1]));
      if (hit) {
        e.preventDefault();
        parts[parts.length - 1] = hit;
        setValue(parts.join(" "));
      }
    }
  };

  const ps1 = `${profile.user}@${profile.host}:~$`;
  return (
    <div className="shell" onClick={() => input.current?.focus({ preventScroll: true })}>
      <div ref={screen} className="shell-screen" aria-live="polite">
        {lines.map((l, i) => (
          <pre key={i} className={`shell-line shell-line--${l.kind}`}>
            {l.kind === "in" ? <><span className="ps1">{ps1}</span> {l.text}</> : l.text}
          </pre>
        ))}
        <form onSubmit={submit} className="shell-form">
          <label htmlFor="shell-in" className="ps1">{ps1}</label>
          <input
            id="shell-in"
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Shell command"
          />
        </form>
      </div>
    </div>
  );
}
