import { useState } from 'react';

type Scenario = 'ok' | 'http_500' | 'network';

type LogEntry = { line: string; tone: 'info' | 'good' | 'bad' };

function fakeFetch(scenario: Scenario): Promise<Response> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (scenario === 'network') {
        reject(new TypeError('Failed to fetch'));
        return;
      }
      if (scenario === 'http_500') {
        resolve(new Response('{"error":"boom"}', { status: 500 }));
        return;
      }
      resolve(new Response('{"status":{},"completed_at":null}', { status: 200 }));
    }, 200);
  });
}

export default function ErrorPathsDemo() {
  const [scenario, setScenario] = useState<Scenario>('ok');
  const [log, setLog] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const trace: LogEntry[] = [];
    try {
      trace.push({ line: 'await fetch(...)', tone: 'info' });
      const response = await fakeFetch(scenario);
      trace.push({ line: `→ resolved with status ${response.status}`, tone: 'info' });
      if (!response.ok) {
        trace.push({ line: '!response.ok → cb() (app-level failure)', tone: 'bad' });
        setLog(trace);
        setRunning(false);
        return;
      }
      trace.push({ line: 'await response.json()', tone: 'info' });
      await response.json();
      trace.push({ line: '→ success path, schedule next poll', tone: 'good' });
    } catch (e) {
      trace.push({ line: `catch → ${(e as Error).message} → cb()`, tone: 'bad' });
    }
    setLog(trace);
    setRunning(false);
  };

  const toneColor = (t: LogEntry['tone']) =>
    t === 'good' ? 'var(--ink)' : t === 'bad' ? '#b94a48' : 'var(--ink-soft)';

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <label style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
          scenario:{' '}
          <select value={scenario} onChange={(e) => setScenario(e.target.value as Scenario)}>
            <option value="ok">200 OK</option>
            <option value="http_500">500 Internal Server Error</option>
            <option value="network">network failure</option>
          </select>
        </label>
        <button onClick={run} disabled={running}>
          {running ? 'running…' : 'run'}
        </button>
      </div>
      <pre
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.9rem',
          background: 'transparent',
          margin: 0,
          padding: '0.5rem 0.75rem',
          border: '1px solid var(--rule)',
          minHeight: '6rem',
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: 'var(--ink-soft)' }}>// pick a scenario and click run</span>
        ) : (
          log.map((entry, i) => (
            <div key={i} style={{ color: toneColor(entry.tone) }}>
              {entry.line}
            </div>
          ))
        )}
      </pre>
    </div>
  );
}
