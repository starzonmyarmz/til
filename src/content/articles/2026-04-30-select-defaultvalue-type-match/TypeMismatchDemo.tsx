import { useMemo, useState } from 'react';
import { Demo, Panel, Select } from '../../../components/demo';

type ValueType = 'string' | 'boolean';
type BoolString = 'true' | 'false';

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
    <Demo>
      <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ minWidth: '8rem', color: 'var(--ink-soft)' }}>option value type</span>
          <Select
            value={optionType}
            onChange={setOptionType}
            options={[
              { value: 'string', label: 'string' },
              { value: 'boolean', label: 'boolean' },
            ]}
          />
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ minWidth: '8rem', color: 'var(--ink-soft)' }}>defaultValue type</span>
          <Select
            value={defaultType}
            onChange={setDefaultType}
            options={[
              { value: 'boolean', label: 'boolean' },
              { value: 'string', label: 'string' },
            ]}
          />
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ minWidth: '8rem', color: 'var(--ink-soft)' }}>defaultValue</span>
          <Select<BoolString>
            value={String(defaultBool) as BoolString}
            onChange={(v) => setDefaultBool(v === 'true')}
            options={[
              { value: 'true', label: 'true' },
              { value: 'false', label: 'false' },
            ]}
          />
        </label>
      </div>
      <Panel>
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
      </Panel>
    </Demo>
  );
}
