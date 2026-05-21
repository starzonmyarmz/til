import { useMemo, useState } from 'react';
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Input,
  Output,
  OutputRow,
  Hint,
} from '../../../components/demo';

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
    <Demo>
      <p style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
        Type a raw <code>?timeframe=</code> value or pick a preset. The resolver applies the same
        whitelist-or-default that the controller does:{' '}
        <code>params[:timeframe].presence_in(RANGES.keys) || DEFAULT</code>.
      </p>

      <Toolbar>
        <ToggleGroup
          variant="pill"
          value={raw}
          onChange={setRaw}
          options={PRESETS.map((p) => ({ value: p, label: p === '' ? '(blank)' : p }))}
        />
      </Toolbar>

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
      <Input
        type="text"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="?timeframe="
        style={{ marginBottom: '0.75rem' }}
      />

      <Output grid>
        <OutputRow label="raw:">
          {raw === '' ? <em style={{ color: 'var(--ink-soft)' }}>(empty)</em> : raw}
        </OutputRow>
        <OutputRow label="resolved:">
          {resolved}
          {fellBack && (
            <span data-tone="warn" style={{ marginLeft: '0.5rem' }}>
              ← unknown, fell back to DEFAULT
            </span>
          )}
        </OutputRow>
        <OutputRow label="range:">
          {fmt(start)} … {fmt(end)}
        </OutputRow>
      </Output>

      <Hint>
        “Today” is pinned to 2026-05-21 for this demo. Notice that the unknown value{' '}
        <code>bananas</code> doesn’t throw, doesn’t render a broken Select — it just resolves to{' '}
        <code>this_month</code>, same as the empty string would.
      </Hint>
    </Demo>
  );
}
