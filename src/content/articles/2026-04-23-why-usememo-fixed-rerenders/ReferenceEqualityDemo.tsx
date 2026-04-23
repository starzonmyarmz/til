import { useMemo, useState } from 'react';

export default function ReferenceEqualityDemo() {
  const [tick, setTick] = useState(0);
  const [memoize, setMemoize] = useState(false);

  const freshObject = { id: 1, name: 'Dan' };
  const memoized = useMemo(() => ({ id: 1, name: 'Dan' }), []);
  const shown = memoize ? memoized : freshObject;

  // A cheap way to show "did the reference change between renders?"
  // We stash the previous reference on a module-level ref via closure.
  const prev = (ReferenceEqualityDemo as any)._prev?.[memoize ? 'm' : 'f'];
  (ReferenceEqualityDemo as any)._prev = {
    ...(ReferenceEqualityDemo as any)._prev,
    [memoize ? 'm' : 'f']: shown,
  };
  const sameAsPrev = prev === shown;

  return (
    <div className="demo">
      <div className="demo-label">Interactive · Reference equality</div>
      <p style={{ margin: '0 0 0.75rem', color: 'var(--ink-soft)', fontSize: '0.92rem' }}>
        Click re-render. Toggle <code>useMemo</code> and watch whether the object reference stays the same.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setTick((t) => t + 1)}>Re-render ({tick})</button>
        <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontFamily: 'var(--mono)', fontSize: '0.9rem' }}>
          <input type="checkbox" checked={memoize} onChange={(e) => setMemoize(e.target.checked)} />
          useMemo
        </label>
        <span style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.85rem',
          marginLeft: 'auto',
          padding: '0.25rem 0.55rem',
          borderRadius: 4,
          background: sameAsPrev ? '#d4e9d1' : '#f4d9cf',
          color: '#1a1a1a',
        }}>
          {sameAsPrev ? 'same reference ✓' : 'new reference ✗'}
        </span>
      </div>
    </div>
  );
}
