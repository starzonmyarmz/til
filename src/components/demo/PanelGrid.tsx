import type { ReactNode } from 'react';

type Props = {
  /** Number of columns. Default 2. */
  columns?: number;
  children: ReactNode;
};

/**
 * Side-by-side layout for two or more Panels — e.g. raw input next to
 * parsed output.
 */
export default function PanelGrid({ columns = 2, children }: Props) {
  return (
    <div className="panel-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {children}
    </div>
  );
}
