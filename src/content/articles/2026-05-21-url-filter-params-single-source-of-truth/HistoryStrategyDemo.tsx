import { useState } from 'react';
import {
  Demo,
  Toolbar,
  Spacer,
  ToggleGroup,
  Button,
  Output,
  Hint,
} from '../../../components/demo';

type Strategy = 'replace' | 'assign';

const TIMEFRAMES = ['this_month', 'last_month', 'last_7_days', 'last_year'] as const;
const ORIGIN = '/dashboard';

export default function HistoryStrategyDemo() {
  const [strategy, setStrategy] = useState<Strategy>('replace');
  const [stack, setStack] = useState<string[]>([ORIGIN, '/payments/payouts?timeframe=this_month']);
  const [pointer, setPointer] = useState(1);

  const current = stack[pointer];

  function pick(value: string) {
    const nextUrl = `/payments/payouts?timeframe=${value}`;
    if (strategy === 'replace') {
      const next = stack.slice(0, pointer + 1);
      next[pointer] = nextUrl;
      setStack(next);
    } else {
      const next = stack.slice(0, pointer + 1);
      next.push(nextUrl);
      setStack(next);
      setPointer(next.length - 1);
    }
  }

  function back() {
    if (pointer > 0) setPointer(pointer - 1);
  }

  function reset(s: Strategy) {
    setStrategy(s);
    setStack([ORIGIN, '/payments/payouts?timeframe=this_month']);
    setPointer(1);
  }

  return (
    <Demo>
      <Hint>
        Pick a few timeframes, then press <strong>Back</strong>. With <code>location.replace</code>,
        the back button returns to the dashboard. With <code>location.assign</code>, every filter
        change is its own entry.
      </Hint>

      <Toolbar>
        <ToggleGroup
          value={strategy}
          onChange={(s) => reset(s as Strategy)}
          options={[
            { value: 'replace', label: 'location.replace' },
            { value: 'assign', label: 'location.assign' },
          ]}
        />
      </Toolbar>

      <Toolbar>
        <ToggleGroup
          variant="pill"
          value=""
          onChange={pick}
          options={TIMEFRAMES.map((tf) => ({ value: tf, label: tf }))}
        />
        <Spacer />
        <Button variant="pill" onClick={back} disabled={pointer === 0}>
          ← Back
        </Button>
      </Toolbar>

      <Output grid={false}>
        <div className="label" style={{ marginBottom: '0.4rem' }}>history stack</div>
        <ol className="history-stack">
          {stack.map((entry, i) => (
            <li key={i} className={i === pointer ? 'current' : undefined}>
              <span className="entry">{entry}</span>
              {i === pointer && <span className="here">← here</span>}
            </li>
          ))}
        </ol>
        <div className="currently-viewing">
          currently viewing: <code>{current}</code>
        </div>
      </Output>
    </Demo>
  );
}
