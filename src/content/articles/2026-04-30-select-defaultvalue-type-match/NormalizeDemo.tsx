import { useMemo, useState } from 'react';

type RawSettings = {
  credentialed?: boolean | string;
  allow_mvr?: boolean | string;
};

const SAMPLES: Array<{ label: string; value: RawSettings }> = [
  { label: 'all booleans', value: { credentialed: true, allow_mvr: false } },
  { label: 'all strings', value: { credentialed: 'true', allow_mvr: 'false' } },
  { label: 'missing keys', value: {} },
  { label: 'mixed', value: { credentialed: 'true', allow_mvr: false } },
];

function normalize(raw: RawSettings | undefined) {
  return {
    credentialed: String(raw?.credentialed) === 'true',
    allow_mvr: String(raw?.allow_mvr) === 'true',
  };
}

export default function NormalizeDemo() {
  const [idx, setIdx] = useState(0);
  const sample = SAMPLES[idx];
  const normalized = useMemo(() => normalize(sample.value), [sample]);

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {SAMPLES.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setIdx(i)}
            style={
              i === idx
                ? undefined
                : { background: 'transparent', color: 'var(--ink-soft)', border: '1px solid var(--rule)' }
            }
          >
            {s.label}
          </button>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          fontFamily: 'var(--mono)',
          fontSize: '0.9rem',
        }}
      >
        <div style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--rule)', borderRadius: '4px' }}>
          <div style={{ color: 'var(--ink-soft)', marginBottom: '0.3rem' }}>raw input</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(sample.value, null, 2)}</pre>
        </div>
        <div style={{ padding: '0.6rem 0.75rem', border: '1px solid var(--rule)', borderRadius: '4px' }}>
          <div style={{ color: 'var(--ink-soft)', marginBottom: '0.3rem' }}>normalized · boolean</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalized, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
