import type { ReactNode } from 'react';
import type { Tone } from './Console';

type Props = {
  tone?: Tone;
  children: ReactNode;
};

/**
 * Small mono pill for status, state, or category labels. Pair with a `tone`
 * to color the background semantically.
 */
export default function Badge({ tone = 'info', children }: Props) {
  return (
    <span className="badge" data-tone={tone}>
      {children}
    </span>
  );
}
