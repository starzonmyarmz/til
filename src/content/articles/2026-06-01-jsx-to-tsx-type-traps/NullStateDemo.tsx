import { useState } from 'react';
import { Demo, ToggleGroup, Output, OutputRow, Badge, Hint } from '../../../components/demo';

type Mode = 'inferred' | 'annotated';

export default function NullStateDemo() {
  const [mode, setMode] = useState<Mode>('inferred');

  const inferred = mode === 'inferred';

  const stateType = inferred ? 'null' : 'Error | null';
  const arrayType = inferred ? 'never[]' : 'ApiError[]';
  const readOk = !inferred;
  const setOk = !inferred;

  return (
    <Demo>
      <ToggleGroup
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        variant="primary"
        options={[
          { value: 'inferred', label: 'useState(null)' },
          { value: 'annotated', label: 'useState<Error | null>(null)' },
        ]}
      />
      <Output grid={false}>
        <OutputRow label="error state type:">
          <code>{stateType}</code>
        </OutputRow>
        <OutputRow label="apiErrors type:">
          <code>{arrayType}</code>
        </OutputRow>
        <OutputRow label="read error.message:">
          {readOk ? <Badge tone="good">ok</Badge> : <Badge tone="bad">Property 'message' on 'never'</Badge>}
        </OutputRow>
        <OutputRow label="setApiErrors(json.errors):">
          {setOk ? <Badge tone="good">ok</Badge> : <Badge tone="bad">not assignable to never[]</Badge>}
        </OutputRow>
      </Output>
      <Hint>
        The initial value is <code>null</code> and <code>[]</code> in both modes — only the type
        argument changes. Inference reads the first frame and stops; the type parameter describes
        every value the state will hold.
      </Hint>
    </Demo>
  );
}
