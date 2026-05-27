import { useRef } from 'react';
import { Demo, Toolbar, Button, Console, type ConsoleLine, Hint } from '../../../components/demo';
import { useState } from 'react';

type AudioCtxLike = AudioContext & { state: AudioContextState };

function getCtx(ref: React.MutableRefObject<AudioCtxLike | null>): AudioCtxLike {
  if (!ref.current) {
    const Ctor =
      (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext) as typeof AudioContext;
    ref.current = new Ctor() as AudioCtxLike;
  }
  if (ref.current.state === 'suspended') {
    void ref.current.resume();
  }
  return ref.current;
}

function playBeeLaunch(ctx: AudioContext) {
  const t = ctx.currentTime;
  const o = ctx.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(600, t);
  o.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.25, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.12);

  const o2 = ctx.createOscillator();
  o2.type = 'sawtooth';
  o2.frequency.value = 220;
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.05, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
  o2.connect(g2);
  g2.connect(ctx.destination);
  o2.start(t);
  o2.stop(t + 0.18);
}

function playBark(ctx: AudioContext) {
  const t = ctx.currentTime;
  for (let k = 0; k < 2; k++) {
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(420 + Math.random() * 120, t + k * 0.12);
    o.frequency.exponentialRampToValueAtTime(180, t + k * 0.12 + 0.08);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, t + k * 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, t + k * 0.12 + 0.1);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t + k * 0.12);
    o.stop(t + k * 0.12 + 0.1);
  }
}

function playStream(ctx: AudioContext) {
  const t = ctx.currentTime;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 1.0, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const env = Math.min(1, i / 2000) * Math.max(0, 1 - i / data.length);
    data[i] = (Math.random() * 2 - 1) * env * 0.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const filt = ctx.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = 2400;
  filt.Q.value = 1.5;
  const g = ctx.createGain();
  g.gain.value = 0.25;
  src.connect(filt);
  filt.connect(g);
  g.connect(ctx.destination);
  src.start(t);
}

function playChime(ctx: AudioContext) {
  const t = ctx.currentTime;
  [880, 1320, 1760].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t + i * 0.05);
    g.gain.linearRampToValueAtTime(0.2, t + i * 0.05 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.25);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t + i * 0.05);
    o.stop(t + i * 0.05 + 0.25);
  });
}

export default function GardenAudioDemo() {
  const ctxRef = useRef<AudioCtxLike | null>(null);
  const [lines, setLines] = useState<ConsoleLine[]>([]);

  function fire(name: string, fn: (ctx: AudioContext) => void, tone: ConsoleLine['tone']) {
    const ctx = getCtx(ctxRef);
    fn(ctx);
    setLines((prev) =>
      [...prev, { line: `${name} → ${ctx.state} · ${ctx.currentTime.toFixed(2)}s`, tone }].slice(-8),
    );
  }

  return (
    <Demo>
      <Toolbar>
        <Button onClick={() => fire('bee launch', playBeeLaunch, 'info')}>🐝 launch</Button>
        <Button onClick={() => fire('pollination chime', playChime, 'good')}>🌼 chime</Button>
        <Button onClick={() => fire('dog bark', playBark, 'warn')}>🐶 bark</Button>
        <Button onClick={() => fire('pee stream', playStream, 'bad')}>💛 stream</Button>
      </Toolbar>

      <Console
        lines={lines}
        placeholder="click any button — the AudioContext starts on the first user gesture."
      />

      <Hint>
        Each click builds a fresh node graph: oscillator (or noise buffer) → optional filter → gain
        envelope → destination. Nothing is loaded; the source material is the synthesis recipe.
      </Hint>
    </Demo>
  );
}
