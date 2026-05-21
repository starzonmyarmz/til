import type { ReactNode } from 'react';

type Props = {
  label?: string;
  children: ReactNode;
};

export default function Demo({ label = 'Interactive · React', children }: Props) {
  return (
    <div className="demo">
      <div className="demo-label">{label}</div>
      {children}
    </div>
  );
}
