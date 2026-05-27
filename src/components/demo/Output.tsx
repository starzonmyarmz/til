import type { ReactNode } from 'react';

type Props = {
  /** Render as a 2-column grid (label/value pairs). Default true. */
  grid?: boolean;
  children: ReactNode;
};

/**
 * Bordered mono panel for showing computed output. Pair with <OutputRow>;
 * in grid mode each row contributes two cells so label and value align in
 * columns. Set `grid={false}` for free-form content.
 */
export default function Output({ grid = true, children }: Props) {
  return <div className={grid ? 'output grid' : 'output'}>{children}</div>;
}

export function OutputRow({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <span className="label">{label}</span>
      <span className="value">{children}</span>
    </>
  );
}
