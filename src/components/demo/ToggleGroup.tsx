import type { ReactNode } from 'react';
import Button from './Button';

type Option<T extends string> = {
  value: T;
  label: ReactNode;
};

type Props<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: ReadonlyArray<Option<T>>;
  variant?: 'primary' | 'pill';
};

/**
 * Mutually-exclusive button group. Use `primary` for binary before/after
 * toggles and `pill` for longer lists of options.
 */
export default function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  variant = 'primary',
}: Props<T>) {
  return (
    <>
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={variant}
          active={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </>
  );
}
