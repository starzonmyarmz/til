import { useMemo, useState } from 'react';

const TIMEFRAMES = [
  'this_month',
  'last_month',
  'last_7_days',
  'last_30_days',
  'last_3_months',
  'last_6_months',
  'this_year',
  'last_year',
] as const;

type Timeframe = (typeof TIMEFRAMES)[number];
const DEFAULT: Timeframe = 'this_month';

const TODAY = new Date(2026, 4, 21);

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
}

const RANGES: Record<Timeframe, () => [Date, Date]> = {
  this_month: () => [startOfMonth(TODAY), endOfMonth(TODAY)],
  last_month: () => {
    const prev = addMonths(TODAY, -1);
    return [startOfMonth(prev), endOfMonth(prev)];
  },
  last_7_days: () => [addDays(TODAY, -6), TODAY],
  last_30_days: () => [addDays(TODAY, -29), TODAY],
  last_3_months: () => [addMonths(TODAY, -3), TODAY],
  last_6_months: () => [addMonths(TODAY, -6), TODAY],
  this_year: () => [new Date(TODAY.getFullYear(), 0, 1), new Date(TODAY.getFullYear(), 11, 31)],
  last_year: () => {
    const y = TODAY.getFullYear() - 1;
    return [new Date(y, 0, 1), new Date(y, 11, 31)];
  },
};

function resolve(raw: string): { resolved: Timeframe; fellBack: boolean } {
  const known = (TIMEFRAMES as readonly string[]).includes(raw);
  return { resolved: known ? (raw as Timeframe) : DEFAULT, fellBack: !known };
}

const PRESETS = [
  'this_month',
  'last_7_days',
  'last_year',
  'bananas',
  '',
  'THIS_MONTH',
  'last_month',
];

export default function TimeframeResolver() {
  const [raw, setRaw] = useState('bananas');

  const { resolved, fellBack } = useMemo(() => resolve(raw), [raw]);
  const [start, end] = useMemo(() => RANGES[resolved](), [resolved]);

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <p style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
        Type a raw <code>?timeframe=</code> value or pick a preset. The resolver applies the same
        whitelist-or-default that the controller does:{' '}
        <code>params[:timeframe].presence_in(RANGES.keys) || DEFAULT</code>.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
        {PRESETS.map((p) => (
          <button
            key={p || '(blank)'}
            onClick={() => setRaw(p)}
            style={
              p === raw
                ? { fontFamily: 'var(--mono)', fontSize: '0.8rem' }
                : {
                    background: 'transparent',
                    color: 'var(--ink-soft)',
                    border: '1px solid var(--rule)',
                    fontFamily: 'var(--mono)',
                    fontSize: '0.8rem',
                  }
            }
          >
            {p === '' ? '(blank)' : p}
          </button>
        ))}
      </div>

      <label
        style={{
          display: 'block',
          fontFamily: 'var(--mono)',
          fontSize: '0.8rem',
          color: 'var(--ink-soft)',
          marginBottom: '0.25rem',
        }}
      >
        raw param value
      </label>
      <input
        type="text"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="?timeframe="
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
          marginBottom: '0.75rem',
        }}
      />

      <div
        style={{
          padding: '0.75rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          fontFamily: 'var(--mono)',
          fontSize: '0.85rem',
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          columnGap: '0.75rem',
          rowGap: '0.35rem',
        }}
      >
        <span style={{ color: 'var(--ink-soft)' }}>raw:</span>
        <span>{raw === '' ? <em style={{ color: 'var(--ink-soft)' }}>(empty)</em> : raw}</span>

        <span style={{ color: 'var(--ink-soft)' }}>resolved:</span>
        <span>
          {resolved}
          {fellBack && (
            <span style={{ marginLeft: '0.5rem', color: 'hsl(42 80% 50%)' }}>
              ← unknown, fell back to DEFAULT
            </span>
          )}
        </span>

        <span style={{ color: 'var(--ink-soft)' }}>range:</span>
        <span>
          {fmt(start)} … {fmt(end)}
        </span>
      </div>

      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
        “Today” is pinned to 2026-05-21 for this demo. Notice that the unknown value{' '}
        <code>bananas</code> doesn’t throw, doesn’t render a broken Select — it just resolves to{' '}
        <code>this_month</code>, same as the empty string would.
      </p>
    </div>
  );
}
