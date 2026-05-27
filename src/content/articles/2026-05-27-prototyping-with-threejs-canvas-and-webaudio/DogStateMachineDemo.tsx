import { useEffect, useRef, useState } from 'react';
import {
  Demo,
  Toolbar,
  Button,
  Badge,
  Output,
  OutputRow,
  Console,
  Hint,
} from '../../../components/demo';
import type { ConsoleLine, Tone } from '../../../components/demo';

type Flower = { x: number; y: number; pollinated: boolean };
type State = 'wandering' | 'chasing' | 'seeking-flower';
type LogEntry = { line: string; tone: Tone; count: number };

const W = 320;
const H = 200;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeFlowers(): Flower[] {
  const arr: Flower[] = [];
  for (let i = 0; i < 6; i++) {
    arr.push({ x: rand(30, W - 30), y: rand(30, H - 30), pollinated: Math.random() < 0.6 });
  }
  return arr;
}

function pushLog(log: LogEntry[], line: string, tone: Tone = 'info') {
  const last = log[0];
  if (last && last.line === line) {
    last.count += 1;
  } else {
    log.unshift({ line, tone, count: 1 });
    if (log.length > 8) log.length = 8;
  }
}

export default function DogStateMachineDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(true);
  const [, setTick] = useState(0);

  const stateRef = useRef({
    dog: { x: W * 0.2, y: H * 0.6 },
    player: { x: W * 0.7, y: H * 0.4 },
    target: { x: W * 0.2, y: H * 0.6 },
    pickTimer: 1.5,
    barkTimer: 4,
    peeTimer: 3,
    peeingAt: null as number | null,
    state: 'wandering' as State,
    flowers: makeFlowers(),
    log: [] as LogEntry[],
  });

  function reset() {
    stateRef.current = {
      dog: { x: W * 0.2, y: H * 0.6 },
      player: { x: W * 0.7, y: H * 0.4 },
      target: { x: W * 0.2, y: H * 0.6 },
      pickTimer: 1.5,
      barkTimer: 4,
      peeTimer: 3,
      peeingAt: null,
      state: 'wandering',
      flowers: makeFlowers(),
      log: [],
    };
    setTick((t) => t + 1);
  }

  function pollinateRandom() {
    const s = stateRef.current;
    const empty = s.flowers.filter((f) => !f.pollinated);
    if (empty.length === 0) return;
    const pick = empty[Math.floor(Math.random() * empty.length)];
    pick.pollinated = true;
    pushLog(s.log, `bee → flower (${Math.round(pick.x)},${Math.round(pick.y)}) pollinated`, 'good');
    setTick((t) => t + 1);
  }

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;

      // priority 1: continue peeing
      if (s.peeingAt !== null) {
        const f = s.flowers[s.peeingAt];
        const dx = f.x - s.dog.x;
        const dy = f.y - s.dog.y;
        const d = Math.hypot(dx, dy);
        if (d < 8) {
          f.pollinated = false;
          pushLog(s.log, `dog peed on flower #${s.peeingAt} → depollinated`, 'bad');
          s.peeingAt = null;
          s.peeTimer = rand(4, 7);
          s.state = 'wandering';
          s.pickTimer = 0;
        } else {
          s.target.x = f.x;
          s.target.y = f.y;
          s.state = 'seeking-flower';
        }
      } else {
        // priority 2: time to pee?
        s.peeTimer -= dt;
        if (s.peeTimer <= 0) {
          let best = -1;
          let bestDist = Infinity;
          s.flowers.forEach((f, i) => {
            if (!f.pollinated) return;
            const dx = f.x - s.dog.x;
            const dy = f.y - s.dog.y;
            const d = Math.hypot(dx, dy);
            if (d < bestDist) {
              bestDist = d;
              best = i;
            }
          });
          if (best >= 0) {
            s.peeingAt = best;
            pushLog(s.log, `dog locked on flower #${best}`, 'warn');
            s.state = 'seeking-flower';
          } else {
            s.peeTimer = 2;
          }
        } else {
          // priority 3: chase player if close
          const pdx = s.player.x - s.dog.x;
          const pdy = s.player.y - s.dog.y;
          const pd = Math.hypot(pdx, pdy);
          if (pd < 70) {
            s.target.x = s.player.x;
            s.target.y = s.player.y;
            s.state = 'chasing';
          } else {
            // priority 4: wander
            s.pickTimer -= dt;
            const tdx = s.target.x - s.dog.x;
            const tdy = s.target.y - s.dog.y;
            if (s.pickTimer <= 0 || Math.hypot(tdx, tdy) < 6) {
              s.target.x = rand(20, W - 20);
              s.target.y = rand(20, H - 20);
              s.pickTimer = rand(2, 4);
            }
            s.state = 'wandering';
          }
        }
      }

      // move toward target
      const tdx = s.target.x - s.dog.x;
      const tdy = s.target.y - s.dog.y;
      const td = Math.hypot(tdx, tdy);
      if (td > 0.5) {
        const speed = s.state === 'chasing' ? 60 : s.state === 'seeking-flower' ? 50 : 30;
        s.dog.x += (tdx / td) * speed * dt;
        s.dog.y += (tdy / td) * speed * dt;
      }

      // barks
      s.barkTimer -= dt;
      if (s.barkTimer <= 0) {
        const near = Math.hypot(s.player.x - s.dog.x, s.player.y - s.dog.y) < 70;
        pushLog(s.log, `woof! (${near ? 'near player' : 'idle'})`, near ? 'warn' : 'info');
        s.barkTimer = near ? rand(1.5, 3) : rand(5, 9);
      }

      // draw
      const canvas = canvasRef.current;
      if (canvas) {
        const x = canvas.getContext('2d');
        if (x) {
          x.fillStyle = '#f4f0e0';
          x.fillRect(0, 0, W, H);
          // grid dots
          x.fillStyle = '#e0dcc8';
          for (let gx = 0; gx <= W; gx += 20) {
            for (let gy = 0; gy <= H; gy += 20) {
              x.fillRect(gx - 0.5, gy - 0.5, 1, 1);
            }
          }
          // flowers
          s.flowers.forEach((f, i) => {
            x.fillStyle = f.pollinated ? '#ff77aa' : '#bbbbbb';
            x.beginPath();
            x.arc(f.x, f.y, f.pollinated ? 8 : 5, 0, Math.PI * 2);
            x.fill();
            x.fillStyle = '#666';
            x.font = '9px sans-serif';
            x.fillText(String(i), f.x - 3, f.y + 3);
          });
          // player
          x.fillStyle = '#3377cc';
          x.beginPath();
          x.arc(s.player.x, s.player.y, 6, 0, Math.PI * 2);
          x.fill();
          x.fillStyle = '#fff';
          x.font = 'bold 9px sans-serif';
          x.fillText('P', s.player.x - 3, s.player.y + 3);
          // dog
          x.fillStyle = '#cc7733';
          x.beginPath();
          x.arc(s.dog.x, s.dog.y, 7, 0, Math.PI * 2);
          x.fill();
          x.fillStyle = '#fff';
          x.font = 'bold 9px sans-serif';
          x.fillText('D', s.dog.x - 3, s.dog.y + 3);
          // target line
          x.strokeStyle = 'rgba(204, 119, 51, 0.4)';
          x.lineWidth = 1;
          x.beginPath();
          x.moveTo(s.dog.x, s.dog.y);
          x.lineTo(s.target.x, s.target.y);
          x.stroke();
        }
      }

      setTick((t) => (t + 1) % 1000);
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const s = stateRef.current;

  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    stateRef.current.player.x = px;
    stateRef.current.player.y = py;
  }

  const toneFor = (state: State): Tone =>
    state === 'chasing' ? 'warn' : state === 'seeking-flower' ? 'bad' : 'good';

  const logLines: ConsoleLine[] = s.log.map((entry) => ({
    line: entry.count > 1 ? `${entry.line}  ×${entry.count}` : entry.line,
    tone: entry.tone,
  }));

  return (
    <Demo>
      <Toolbar>
        <Button variant="primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'pause' : 'play'}
        </Button>
        <Button onClick={pollinateRandom}>🐝 pollinate one</Button>
        <Button onClick={reset}>reset</Button>
        <span style={{ marginLeft: 'auto' }}>
          <Badge tone={toneFor(s.state)}>{s.state}</Badge>
        </span>
      </Toolbar>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0 1rem' }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onClick={onCanvasClick}
          style={{
            width: '100%',
            maxWidth: W,
            height: 'auto',
            imageRendering: 'pixelated',
            border: '1px solid var(--rule)',
            borderRadius: 4,
            cursor: 'crosshair',
            background: '#f4f0e0',
          }}
        />
      </div>

      <Output>
        <OutputRow label="pee cooldown:">{s.peeTimer.toFixed(1)}s</OutputRow>
        <OutputRow label="bark cooldown:">{s.barkTimer.toFixed(1)}s</OutputRow>
        <OutputRow label="wander cooldown:">{s.pickTimer.toFixed(1)}s</OutputRow>
      </Output>

      <div style={{ marginTop: '0.75rem' }}>
        <Console lines={logLines} placeholder="// waiting for the dog to do something…" />
      </div>

      <Hint>
        Click the canvas to reposition the player. Pink dots are pollinated flowers; grey dots are
        empty. The dog walks to the nearest pink dot, marks it grey, and resets its pee cooldown.
      </Hint>
    </Demo>
  );
}
