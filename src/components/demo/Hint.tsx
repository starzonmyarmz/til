import type { ReactNode } from 'react';

/**
 * Trailing explanatory paragraph for a demo. Soft color, smaller text.
 */
export default function Hint({ children }: { children: ReactNode }) {
  return <p className="hint">{children}</p>;
}
