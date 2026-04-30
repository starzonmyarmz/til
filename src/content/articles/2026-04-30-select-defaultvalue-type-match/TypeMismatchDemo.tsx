import { useMemo, useState } from 'react';

type ValueType = 'string' | 'boolean';

const STRING_OPTIONS = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' },
];

const BOOLEAN_OPTIONS = [
  { label: 'true', value: true },
  { label: 'false', value: false },
];

export default function TypeMismatchDemo() {
  const [optionType, setOptionType] = useState<ValueType>('string');
  const [defaultType, setDefaultType] = useState<ValueType>('boolean');
  const [defaultBool, setDefaultBool] = useState(true);

  const options = optionType === 'string' ? STRING_OPTIONS : BOOLEAN_OPTIONS;
  const defaultValue: string | boolean =
    defaultType === 'string' ? String(defaultBool) : defaultBool;

  const matched = useMemo(
    () => options.find((o) => o.value === defaultValue),
    [options, defaultValue],
  );

  return (
    <div className="demo">
      <div className="demo-label">Interactive · React</div>
      <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ minWidth: '8rem', color: 'var(--ink-soft)' }}>option value type</span>
          <select value={optionType} onChange={(e) => setOptionType(e.target.value as ValueType)}>
            <option value="string">string</option>
            <option value="boolean">boolean</option>
          </select>
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ minWidth: '8rem', color: 'var(--ink-soft)' }}>defaultValue type</span>
          <select value={defaultType} onChange={(e) => setDefaultType(e.target.value as ValueType)}>
            <option value="boolean">boolean</option>
            <option value="string">string</option>
          </select>
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ minWidth: '8rem', color: 'var(--ink-soft)' }}>defaultValue</span>
          <select
            value={String(defaultBool)}
            onChange={(e) => setDefaultBool(e.target.value === 'true')}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </label>
      </div>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.95rem',
          padding: '0.6rem 0.75rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          background: 'transparent',
        }}
      >
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>options:</span>{' '}
          {options.map((o) => `${JSON.stringify(o.value)}`).join(', ')}
        </div>
        <div>
          <span style={{ color: 'var(--ink-soft)' }}>defaultValue:</span>{' '}
          {JSON.stringify(defaultValue)}
        </div>
        <div style={{ marginTop: '0.4rem' }}>
          <span style={{ color: 'var(--ink-soft)' }}>matched option:</span>{' '}
          {matched ? (
            <strong>{matched.label}</strong>
          ) : (
            <span style={{ color: '#b94a48' }}>none — dropdown renders unselected</span>
          )}
        </div>
      </div>
    </div>
  );
}
