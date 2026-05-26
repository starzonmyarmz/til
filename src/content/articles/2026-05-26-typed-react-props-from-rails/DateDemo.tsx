import { useMemo, useState } from 'react';
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Field,
  Input,
  Output,
  OutputRow,
  Hint,
} from '../../../components/demo';

const LOCALES = [
  { value: 'en-US', label: 'en-US' },
  { value: 'en-GB', label: 'en-GB' },
  { value: 'de-DE', label: 'de-DE' },
  { value: 'ja-JP', label: 'ja-JP' },
];

export default function DateDemo() {
  const [iso, setIso] = useState('2026-03-05T23:30:00-05:00');
  const [locale, setLocale] = useState('en-US');

  const formatted = useMemo(() => {
    if (!iso) return '—';
    try {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return 'Invalid date string';
      const formatter = new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
      });
      return formatter.format(date);
    } catch {
      return 'Invalid date string';
    }
  }, [iso, locale]);

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={locale}
          onChange={setLocale}
          variant="pill"
          options={LOCALES}
        />
      </Toolbar>

      <Field label="ISO string from the server">
        <Input value={iso} onChange={(e) => setIso(e.target.value)} />
      </Field>

      <Output grid>
        <OutputRow label="parsed Date:">
          {(() => {
            const d = new Date(iso);
            return Number.isNaN(d.getTime()) ? '—' : d.toISOString();
          })()}
        </OutputRow>
        <OutputRow label="Intl output:">{formatted}</OutputRow>
      </Output>

      <Hint>
        ISO 8601 with an offset is the safe wire format. Parsing happens once, formatting honors the
        locale, and any timezone surprise is the server’s problem instead of the browser’s.
      </Hint>
    </Demo>
  );
}
