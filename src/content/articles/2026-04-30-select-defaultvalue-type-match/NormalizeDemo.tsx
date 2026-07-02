import { useMemo, useState } from 'react';
import { Demo, Panel, PanelGrid, ToggleGroup } from '../../../components/demo';

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
  const [idx, setIdx] = useState('0');
  const sample = SAMPLES[Number(idx)];
  const normalized = useMemo(() => normalize(sample.value), [sample]);

  return (
    <Demo>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        <ToggleGroup
          value={idx}
          onChange={setIdx}
          variant="pill"
          options={SAMPLES.map((s, i) => ({ value: String(i), label: s.label }))}
        />
      </div>
      <PanelGrid columns={2}>
        <Panel title="raw input">
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(sample.value, null, 2)}</pre>
        </Panel>
        <Panel title="normalized · boolean">
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(normalized, null, 2)}</pre>
        </Panel>
      </PanelGrid>
    </Demo>
  );
}
