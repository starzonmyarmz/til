import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Output, OutputRow, Badge, Hint } from '../../../components/demo';

type Annotation = 'empty-array' | 'empty-object' | 'named';

const cases: { value: string; vsEmptyArray: boolean; vsEmptyObject: boolean; vsNamed: boolean }[] = [
  { value: '[]', vsEmptyArray: true, vsEmptyObject: true, vsNamed: true },
  { value: '[{ id: "US" }]', vsEmptyArray: false, vsEmptyObject: true, vsNamed: true },
  { value: '{}', vsEmptyArray: false, vsEmptyObject: true, vsNamed: false },
  { value: '"hello"', vsEmptyArray: false, vsEmptyObject: true, vsNamed: false },
  { value: 'null', vsEmptyArray: false, vsEmptyObject: false, vsNamed: false },
];

const labels: Record<Annotation, string> = {
  'empty-array': 'countries: []',
  'empty-object': 'organization: {}',
  named: 'countries: Country[]',
};

export default function EmptyTypesDemo() {
  const [annotation, setAnnotation] = useState<Annotation>('empty-array');

  const accepts = (c: (typeof cases)[number]) =>
    annotation === 'empty-array'
      ? c.vsEmptyArray
      : annotation === 'empty-object'
        ? c.vsEmptyObject
        : c.vsNamed;

  const meaning: Record<Annotation, string> = {
    'empty-array': 'the empty tuple — an array with exactly zero elements',
    'empty-object': 'any value that is not null or undefined',
    named: 'an array holding any number of Country values',
  };

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={annotation}
          onChange={(v) => setAnnotation(v as Annotation)}
          variant="pill"
          options={[
            { value: 'empty-array', label: '[]' },
            { value: 'empty-object', label: '{}' },
            { value: 'named', label: 'Country[]' },
          ]}
        />
      </Toolbar>
      <Output>
        <OutputRow label="annotation:">{labels[annotation]}</OutputRow>
        <OutputRow label="means:">{meaning[annotation]}</OutputRow>
      </Output>
      <Output>
        {cases.map((c) => (
          <OutputRow key={c.value} label={c.value}>
            {accepts(c) ? (
              <Badge tone="good">accepted</Badge>
            ) : (
              <Badge tone="bad">rejected</Badge>
            )}
          </OutputRow>
        ))}
      </Output>
      <Hint>
        Switch the annotation and watch which assignments survive. <code>[]</code> only accepts an
        empty literal; <code>{'{}'}</code> accepts nearly everything but exposes no properties;{' '}
        <code>Country[]</code> is the type the other two were mistaken for.
      </Hint>
    </Demo>
  );
}
