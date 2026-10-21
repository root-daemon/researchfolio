// A tiny step-sequencer on the Web Audio API. Every track is generated live from
// the patterns below, so there are no audio files and nothing is licensed.

type Track = {
  name: string;
  bpm: number;
  key: number; // MIDI note the chord offsets are relative to
  chords: number[][]; // one chord per bar
  bass: { wave: OscillatorType; steps: string };
  arp: { wave: OscillatorType; steps: number[]; octave: number; cutoff: number };
  pad?: boolean;
  drums: { kick: string; snare: string; hat: string };
};

// 16 steps per bar. "x" = hit, "." = rest. Arp steps index into [root, third, fifth, octave]; -1 rests.
export const TRACKS: Track[] = [
  {
    name: "boot.sys",
    bpm: 102,
    key: 57,
    chords: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]],
    bass: { wave: "sawtooth", steps: "x.x.x.x.x.x.x.xx" },
    arp: { wave: "square", steps: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1, 0, 2, 3, 2], octave: 1, cutoff: 2400 },
    pad: true,
    drums: { kick: "x...x...x...x...", snare: "....x.......x...", hat: "..x...x...x...x." },
  },
  {
    name: "night_shift",
    bpm: 84,
    key: 50,
    chords: [[0, 3, 7], [-4, 0, 3], [-7, -4, 0], [-5, -1, 2]],
    bass: { wave: "triangle", steps: "x.......x...x..." },
    arp: { wave: "triangle", steps: [0, -1, 2, -1, 1, -1, 3, -1, 2, -1, 1, -1, 0, -1, 2, -1], octave: 2, cutoff: 1800 },
    pad: true,
    drums: { kick: "x.......x.x.....", snare: "....x.......x...", hat: "x.x.x.x.x.x.x.x." },
  },
  {
    name: "clutch_round",
    bpm: 132,
    key: 52,
    chords: [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]],
    bass: { wave: "square", steps: "x.xxx.xxx.xxx.xx" },
    arp: { wave: "square", steps: [0, 1, 2, 3, 0, 1, 2, 3, 3, 2, 1, 0, 3, 2, 1, 0], octave: 2, cutoff: 5000 },
    drums: { kick: "x..x..x.x..x..x.", snare: "....x.......x..x", hat: "xxxxxxxxxxxxxxxx" },
  },
];

const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);

type State = { playing: boolean; track: number };
type Listener = (s: State) => void;

class Synth {
  ctx: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer = 0;
  private step = 0;
  private next = 0;
  private listeners = new Set<Listener>();
  state: State = { playing: false, track: 0 };

  private init() {
    if (this.ctx) return this.ctx;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.16;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 1024;
    this.master.connect(this.analyser).connect(ctx.destination);
    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    fn(this.state);
    return () => { this.listeners.delete(fn); };
  }

  private emit() {
    this.listeners.forEach((fn) => fn(this.state));
  }

  play(track = this.state.track) {
    const ctx = this.init();
    void ctx.resume();
    window.clearInterval(this.timer);
    this.state = { playing: true, track: (track + TRACKS.length) % TRACKS.length };
    this.step = 0;
    this.next = ctx.currentTime + 0.05;
    // Look-ahead scheduler: wake often, queue anything due in the next 120ms.
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.emit();
  }

  stop() {
    window.clearInterval(this.timer);
    this.state = { ...this.state, playing: false };
    this.emit();
  }

  toggle() {
    if (this.state.playing) this.stop();
    else this.play();
  }

  skip(dir: 1 | -1) {
    this.play(this.state.track + dir);
  }

  private schedule() {
    const ctx = this.ctx!;
    const t = TRACKS[this.state.track];
    const dur = 60 / t.bpm / 4;
    while (this.next < ctx.currentTime + 0.12) {
      this.playStep(t, this.step, this.next, dur);
      this.next += dur;
      this.step++;
    }
  }

  private playStep(t: Track, step: number, at: number, dur: number) {
    const s = step % 16;
    const chord = t.chords[Math.floor(step / 16) % t.chords.length].map((n) => n + t.key);
    if (t.bass.steps[s] === "x") this.tone(hz(chord[0] - 12), at, dur * 1.6, t.bass.wave, 0.5, 700);
    const a = t.arp.steps[s];
    if (a >= 0) {
      const tones = [...chord, chord[0] + 12];
      this.tone(hz(tones[a] + 12 * t.arp.octave), at, dur * 0.9, t.arp.wave, 0.18, t.arp.cutoff);
    }
    if (t.pad && s === 0) chord.forEach((n) => this.tone(hz(n + 12), at, dur * 15, "sawtooth", 0.06, 900, 0.4));
    if (t.drums.kick[s] === "x") this.kick(at);
    if (t.drums.snare[s] === "x") this.hit(at, 0.18, 1200, 0.35);
    if (t.drums.hat[s] === "x") this.hit(at, 0.04, 7000, 0.12);
  }

  private tone(f: number, at: number, len: number, wave: OscillatorType, vol: number, cutoff: number, attack = 0.005) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    o.type = wave;
    o.frequency.value = f;
    lp.frequency.value = cutoff;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol, at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(lp).connect(g).connect(this.master!);
    o.start(at);
    o.stop(at + len + 0.05);
  }

  private kick(at: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, at);
    o.frequency.exponentialRampToValueAtTime(40, at + 0.12);
    g.gain.setValueAtTime(0.9, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.3);
    o.connect(g).connect(this.master!);
    o.start(at);
    o.stop(at + 0.32);
  }

  private hit(at: number, len: number, highpass: number, vol: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    const hp = ctx.createBiquadFilter();
    const g = ctx.createGain();
    src.buffer = this.noise;
    hp.type = "highpass";
    hp.frequency.value = highpass;
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    src.connect(hp).connect(g).connect(this.master!);
    src.start(at, Math.random() * 0.5);
    src.stop(at + len + 0.02);
  }
}

// One deck for the whole site, so the shell and the tape player control the same audio.
export const synth = new Synth();
