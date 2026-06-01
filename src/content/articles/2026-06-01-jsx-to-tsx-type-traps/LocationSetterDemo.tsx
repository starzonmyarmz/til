import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Output, OutputRow, Badge, Hint } from '../../../components/demo';

type Form = 'shorthand' | 'href';

export default function LocationSetterDemo() {
  const [form, setForm] = useState<Form>('shorthand');

  const shorthand = form === 'shorthand';
  const target = shorthand ? 'window.location' : 'window.location.href';
  const targetType = shorthand ? 'string & Location' : 'string';
  const typeChecks = !shorthand;

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={form}
          onChange={(v) => setForm(v as Form)}
          variant="primary"
          options={[
            { value: 'shorthand', label: 'window.location = url' },
            { value: 'href', label: 'window.location.href = url' },
          ]}
        />
      </Toolbar>
      <Output>
        <OutputRow label="assigning to:">
          <code>{target}</code>
        </OutputRow>
        <OutputRow label="property type:">
          <code>{targetType}</code>
        </OutputRow>
        <OutputRow label="assigning a string:">
          {typeChecks ? (
            <Badge tone="good">ok</Badge>
          ) : (
            <Badge tone="bad">string not assignable to string &amp; Location</Badge>
          )}
        </OutputRow>
        <OutputRow label="navigates at runtime:">
          <Badge tone="good">yes — both</Badge>
        </OutputRow>
      </Output>
      <Hint>
        Both navigate. The shorthand fails the type check because the DOM library types{' '}
        <code>location</code> as an intersection — a readable <code>Location</code> object whose
        setter also takes a string — and a plain string is not also a <code>Location</code>. The{' '}
        <code>.href</code> property is typed as a plain string.
      </Hint>
    </Demo>
  );
}
