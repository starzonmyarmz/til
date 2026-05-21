import type { ReactNode } from 'react';

export type Tone = 'info' | 'good' | 'warn' | 'bad';

export type ConsoleLine = {
  line: ReactNode;
  tone?: Tone;
};

type Props = {
  lines: ReadonlyArray<ConsoleLine>;
  placeholder?: ReactNode;
};

/**
 * Mono console output. Each line gets a tone color via [data-tone].
 * Pass `placeholder` for the empty state.
 */
export default function Console({
  lines,
  placeholder = '// pick a scenario and click run',
}: Props) {
  return (
    <pre className="console">
      {lines.length === 0 ? (
        <span className="placeholder">{placeholder}</span>
      ) : (
        lines.map((entry, i) => (
          <span key={i} className="line" data-tone={entry.tone ?? 'info'}>
            {entry.line}
          </span>
        ))
      )}
    </pre>
  );
}
