import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'pill';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: Variant;
  active?: boolean;
  children: ReactNode;
};

/**
 * Demo button. `primary` matches the default `.demo button` styling
 * (outlined, fills on hover/active). `pill` is the smaller mono chip used
 * for option groups. Pass `active` to mark the currently-selected option.
 */
export default function Button({
  variant = 'primary',
  active = false,
  children,
  ...rest
}: Props) {
  const classes: string[] = [];
  if (variant === 'pill') classes.push('pill');
  if (active) classes.push('active');
  return (
    <button className={classes.join(' ') || undefined} {...rest}>
      {children}
    </button>
  );
}
