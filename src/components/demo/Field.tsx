import type { ReactNode } from 'react';

type Props = {
  label: ReactNode;
  children: ReactNode;
};

/**
 * A labeled row: mono label on the left, control on the right. Use to stack
 * configuration inputs above the demo output.
 */
export default function Field({ label, children }: Props) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
