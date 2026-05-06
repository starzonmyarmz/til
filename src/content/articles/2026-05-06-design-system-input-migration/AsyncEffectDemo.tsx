import { useState, useEffect, useRef } from 'react';

type Mode = 'before' | 'after';

const DELAY_MS = 800;

function fakeEmailCheck(email: string): Promise<string | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email.endsWith('@gmial.com')) resolve('gmail.com');
      else if (email.endsWith('@yaho.com')) resolve('yahoo.com');
      else resolve(null);
    }, DELAY_MS);
  });
}

function BeforeComponent() {
  const [value, setValue] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!value.includes('@')) {
      setSuggestion(null);
      return;
    }
    setStatus('fetching…');
    // ❌ useEffect callback can't be async — this returns a Promise
    // useEffect(async () => { ... }) — broken!
    // Instead the original code used .then()/.catch():
    fakeEmailCheck(value)
      .then((s) => {
        setSuggestion(s);
        setStatus('done');
      })
      .catch(() => {
        setSuggestion(null);
        setStatus('error');
      });
  }, [value]);

  return <View value={value} setValue={setValue} suggestion={suggestion} status={status} mode="before" />;
}

function AfterComponent() {
  const [value, setValue] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!value.includes('@')) {
      setSuggestion(null);
      return;
    }

    // ✅ Inner async function, called immediately
    const check = async () => {
      setStatus('fetching…');
      try {
        const s = await fakeEmailCheck(value);
        setSuggestion(s);
        setStatus('done');
      } catch {
        setSuggestion(null);
        setStatus('error');
      }
    };

    check();
  }, [value]);

  return <View value={value} setValue={setValue} suggestion={suggestion} status={status} mode="after" />;
}

function View({
  value,
  setValue,
  suggestion,
  status,
  mode,
}: {
  value: string;
  setValue: (v: string) => void;
  suggestion: string | null;
  status: string;
  mode: Mode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input
        type="email"
        placeholder="try user@gmial.com"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.9rem',
          padding: '0.4rem 0.6rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          background: 'transparent',
          color: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.85rem', color: 'var(--ink-soft)', minHeight: '1.4em' }}>
        {status === 'fetching…' && <span>checking…</span>}
        {status === 'done' && suggestion && (
          <span style={{ color: 'hsl(42 80% 50%)' }}>
            did you mean <strong>{suggestion}</strong>?
          </span>
        )}
        {status === 'done' && !suggestion && value.includes('@') && (
          <span style={{ color: 'hsl(140 50% 45%)' }}>✓ looks good</span>
        )}
      </div>
      <div
        style={{
          padding: '0.6rem 0.75rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          fontFamily: 'var(--mono)',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          whiteSpace: 'pre',
        }}
      >
        {mode === 'before'
          ? `useEffect(() => {\n  fakeCheck(value)\n    .then(s => setSuggestion(s))\n    .catch(() => setSuggestion(null));\n}, [value]);`
          : `useEffect(() => {\n  const check = async () => {\n    try {\n      const s = await fakeCheck(value);\n      setSuggestion(s);\n    } catch {\n      setSuggestion(null);\n    }\n  };\n  check();\n}, [value]);`}
      </div>
    </div>
  );
}

export default function AsyncEffectDemo() {
  const [mode, setMode] = useState<Mode>('before');

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {(['before', 'after'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={
              m === mode
                ? undefined
                : { background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--rule)' }
            }
          >
            {m === 'before' ? '.then()/.catch()' : 'inner async fn'}
          </button>
        ))}
      </div>
      {mode === 'before' ? <BeforeComponent /> : <AfterComponent />}
      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
        Try <code>user@gmial.com</code> or <code>user@yaho.com</code> to trigger a suggestion.
        Both modes behave identically — the difference is readability and the door it opens for cleanup.
      </p>
    </div>
  );
}
