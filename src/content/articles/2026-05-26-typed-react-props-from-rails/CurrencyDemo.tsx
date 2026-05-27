import { useMemo, useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Slider, Output, OutputRow, Hint } from '../../../components/demo';

const LOCALES: { value: string; label: string; currency: string }[] = [
  { value: 'en-US', label: 'en-US · USD', currency: 'USD' },
  { value: 'en-GB', label: 'en-GB · GBP', currency: 'GBP' },
  { value: 'de-DE', label: 'de-DE · EUR', currency: 'EUR' },
  { value: 'ja-JP', label: 'ja-JP · JPY', currency: 'JPY' },
];

export default function CurrencyDemo() {
  const [cents, setCents] = useState(2139657);
  const [locale, setLocale] = useState('en-US');

  const { value: formatted, currency } = useMemo(() => {
    const config = LOCALES.find((l) => l.value === locale)!;
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: config.currency,
    });
    return { value: formatter.format(cents / 100), currency: config.currency };
  }, [cents, locale]);

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={locale}
          onChange={setLocale}
          variant="pill"
          options={LOCALES.map(({ value, label }) => ({ value, label }))}
        />
      </Toolbar>

      <Slider
        label="cents"
        min={0}
        max={50000000}
        value={cents}
        onChange={setCents}
        format={(v) => v.toLocaleString('en-US')}
      />

      <Output>
        <OutputRow label="on the wire:">
          {cents.toLocaleString('en-US')} ({currency} minor units)
        </OutputRow>
        <OutputRow label="divide by 100:">{(cents / 100).toString()}</OutputRow>
        <OutputRow label="Intl output:">{formatted}</OutputRow>
      </Output>

      <Hint>
        The server only sends an integer. The client owns the locale, the symbol, the grouping
        separators, and even whether minor units exist (JPY has none).
      </Hint>
    </Demo>
  );
}
