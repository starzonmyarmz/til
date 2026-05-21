import { useState } from 'react';

type Strategy = 'replace' | 'assign';

const TIMEFRAMES = ['this_month', 'last_month', 'last_7_days', 'last_year'];

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
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <p style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
        Pick a few timeframes, then press <strong>Back</strong>. With{' '}
        <code>location.replace</code>, the back button returns to the dashboard. With{' '}
        <code>location.assign</code>, every filter change is its own entry.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {(['replace', 'assign'] as const).map((s) => (
          <button
            key={s}
            onClick={() => reset(s)}
            style={
              s === strategy
                ? { fontFamily: 'var(--mono)', fontSize: '0.85rem' }
                : {
                    background: 'transparent',
                    color: 'var(--ink-soft)',
                    border: '1px solid var(--rule)',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.85rem',
                  }
            }
          >
            location.{s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => pick(tf)}
            style={{
              background: 'transparent',
              color: 'var(--ink-soft)',
              border: '1px solid var(--rule)',
              fontFamily: 'var(--mono)',
              fontSize: '0.8rem',
            }}
          >
            {tf}
          </button>
        ))}
        <button
          onClick={back}
          disabled={pointer === 0}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.8rem',
            marginLeft: 'auto',
          }}
        >
          ← Back
        </button>
      </div>

      <div
        style={{
          padding: '0.75rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          fontFamily: 'var(--mono)',
          fontSize: '0.85rem',
        }}
      >
        <div style={{ color: 'var(--ink-soft)', marginBottom: '0.35rem' }}>history stack</div>
        <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
          {stack.map((entry, i) => (
            <li
              key={i}
              style={{
                color: i === pointer ? 'inherit' : 'var(--ink-soft)',
                fontWeight: i === pointer ? 600 : 400,
              }}
            >
              {entry}
              {i === pointer && (
                <span style={{ marginLeft: '0.5rem', color: 'hsl(140 50% 45%)' }}>← here</span>
              )}
            </li>
          ))}
        </ol>
        <div style={{ marginTop: '0.5rem', color: 'var(--ink-soft)', fontSize: '0.8rem' }}>
          currently viewing: <code>{current}</code>
        </div>
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
        Selecting four timeframes with <code>assign</code> means four back-button presses to leave
        the page. With <code>replace</code>, one press does it.
      </p>
    </div>
  );
}
