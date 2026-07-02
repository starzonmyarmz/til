import type { ReactNode } from 'react';

type Option<T extends string> = {
  value: T;
  label: ReactNode;
};

type Props<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<Option<T>>;
};

/**
 * Mono dropdown matching Input's styling. Use inside Field for a labeled
 * row, or standalone for an inline scenario/type picker.
 */
export default function Select<T extends string>({ value, onChange, options }: Props<T>) {
  return (
    <select className="select-mono" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
