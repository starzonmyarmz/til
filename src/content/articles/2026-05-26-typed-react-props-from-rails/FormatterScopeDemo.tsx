import { useState } from 'react';
import {
  Demo,
  Toolbar,
  Button,
  Output,
  OutputRow,
  Hint,
} from '../../../components/demo';

const SAMPLE = Array.from({ length: 20000 }, (_, i) => i * 137);

const moduleFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function runInline(values: number[]) {
  const start = performance.now();
  for (const v of values) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    formatter.format(v / 100);
  }
  return performance.now() - start;
}

function runScoped(values: number[]) {
  const start = performance.now();
  for (const v of values) {
    moduleFormatter.format(v / 100);
  }
  return performance.now() - start;
}

export default function FormatterScopeDemo() {
  const [results, setResults] = useState<{ inline: number; scoped: number } | null>(null);

  return (
    <Demo>
      <Toolbar>
        <Button
          variant="primary"
          onClick={() => {
            const inline = runInline(SAMPLE);
            const scoped = runScoped(SAMPLE);
            setResults({ inline, scoped });
          }}
        >
          Format 20,000 amounts
        </Button>
      </Toolbar>

      {results && (
        <Output grid>
          <OutputRow label="constructed each call:">
            {results.inline.toFixed(2)} ms
          </OutputRow>
          <OutputRow label="module-scope reuse:">
            {results.scoped.toFixed(2)} ms
          </OutputRow>
          <OutputRow label="ratio:">
            {(results.inline / Math.max(results.scoped, 0.001)).toFixed(1)}× slower
          </OutputRow>
        </Output>
      )}

      <Hint>
        Constructing <code>Intl.NumberFormat</code> is not free. Hoist it once per module and reuse
        the instance instead of rebuilding it on every render or every row.
      </Hint>
    </Demo>
  );
}
