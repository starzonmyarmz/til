import { useRef, useState } from 'react';

type AppStatus = {
  complete: boolean;
  not_found: boolean;
  error?: string;
};

type Status = Record<string, AppStatus>;

const APPS = ['services', 'people', 'check-ins', 'giving'];

function fakeFetch(tick: number): Promise<{ status: Status; completed_at: string | null }> {
  const status: Status = {};
  APPS.forEach((app, i) => {
    status[app] = { complete: tick > i + 1, not_found: false };
  });
  const completed_at = tick > APPS.length + 1 ? new Date().toISOString() : null;
  return new Promise((resolve) => setTimeout(() => resolve({ status, completed_at }), 250));
}

export default function PollingDemo() {
  const [status, setStatus] = useState<Status | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tickRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = async () => {
    tickRef.current += 1;
    try {
      const data = await fakeFetch(tickRef.current);
      setStatus(data.status);
      if (data.completed_at) {
        setRunning(false);
        setDone(true);
      } else {
        timerRef.current = setTimeout(poll, 600);
      }
    } catch {
      setRunning(false);
    }
  };

  const start = () => {
    if (running) return;
    tickRef.current = 0;
    setStatus(null);
    setDone(false);
    setRunning(true);
    poll();
  };

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    tickRef.current = 0;
    setStatus(null);
    setRunning(false);
    setDone(false);
  };

  const renderAppStatus = (app: string) => {
    if (!status) return 'processing...';
    const s = status[app];
    if (s.complete) return s.not_found ? 'complete (not found)' : 'complete';
    if (s.error) return `error: ${s.error}`;
    return 'processing...';
  };

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <button onClick={start} disabled={running}>
          {running ? 'polling…' : done ? 'restart' : 'start delete'}
        </button>
        <button
          onClick={reset}
          style={{ background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--rule)' }}
        >
          reset
        </button>
        {done && (
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}>completed_at received → cb()</span>
        )}
      </div>
      <ul style={{ fontFamily: 'var(--mono)', fontSize: '0.95rem', margin: 0, paddingLeft: '1.25rem' }}>
        {APPS.map((app) => (
          <li key={app}>
            {app}: <span style={{ color: 'var(--ink-soft)' }}>{renderAppStatus(app)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
