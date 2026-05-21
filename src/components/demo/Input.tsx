import type { InputHTMLAttributes } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

/**
 * Monospaced text input. Full-width by default. Use for `?param=` strings,
 * code-like literal values, anything where the user is typing code.
 */
export default function Input(props: Props) {
  return <input className="input-mono" {...props} />;
}
