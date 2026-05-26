import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Output, OutputRow, Hint } from '../../../components/demo';

const KNOWN = ['giving', 'registrations'] as const;
type KnownApp = (typeof KNOWN)[number];

function isKnownApp(name: string | null): name is KnownApp {
  return name !== null && (KNOWN as readonly string[]).includes(name);
}

const SAMPLES: { value: string; label: string }[] = [
  { value: 'giving', label: 'giving' },
  { value: 'registrations', label: 'registrations' },
  { value: 'check-ins', label: 'check-ins (unknown)' },
  { value: '__null__', label: '(null)' },
];

function renderMark(name: string | null) {
  if (isKnownApp(name)) {
    return <span data-tone="good">✓ render {name} logo</span>;
  }
  return <span data-tone="warn">— skip (no asset for this app)</span>;
}

export default function BrandGuardDemo() {
  const [sample, setSample] = useState<string>('giving');
  const appName = sample === '__null__' ? null : sample;

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup value={sample} onChange={setSample} variant="pill" options={SAMPLES} />
      </Toolbar>

      <Output grid>
        <OutputRow label="prop value:">
          {appName === null ? <span data-tone="info">null</span> : `"${appName}"`}
        </OutputRow>
        <OutputRow label="branch taken:">{renderMark(appName)}</OutputRow>
      </Output>

      <Hint>
        The server can hand back any string the database has. The client decides which strings map
        to assets it actually ships. A whitelist plus a type predicate keeps the render path
        narrow and the type system honest.
      </Hint>
    </Demo>
  );
}
