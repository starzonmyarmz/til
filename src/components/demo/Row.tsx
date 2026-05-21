import type { ReactNode } from 'react';

/**
 * Horizontal flex row with gap. Wraps. Use when the demo needs more than
 * one control on a line and Toolbar's vertical-margin isn't wanted.
 */
export default function Row({ children }: { children: ReactNode }) {
  return <div className="row">{children}</div>;
}
