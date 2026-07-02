import { useState } from 'react';
import {
  Demo,
  Toolbar,
  Button,
  Console,
  Select,
  type ConsoleLine,
} from '../../../components/demo';

type Scenario = 'ok' | 'http_500' | 'network';

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
  const [log, setLog] = useState<ConsoleLine[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const trace: ConsoleLine[] = [];
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

  return (
    <Demo>
      <Toolbar>
        <label style={{ fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
          scenario:{' '}
          <Select
            value={scenario}
            onChange={setScenario}
            options={[
              { value: 'ok', label: '200 OK' },
              { value: 'http_500', label: '500 Internal Server Error' },
              { value: 'network', label: 'network failure' },
            ]}
          />
        </label>
        <Button onClick={run} disabled={running}>
          {running ? 'running…' : 'run'}
        </Button>
      </Toolbar>
      <Console lines={log} placeholder="// pick a scenario and click run" />
    </Demo>
  );
}
