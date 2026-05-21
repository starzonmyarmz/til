import type { ReactNode } from 'react';

type Props = {
  /** Render as a 2-column grid (label/value pairs). Default false. */
  grid?: boolean;
  children: ReactNode;
};

/**
 * Bordered mono panel for showing computed output. Pair with <OutputRow>
 * (or pass `grid` and render label/value pairs as direct children).
 */
export default function Output({ grid = false, children }: Props) {
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
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  );
}
