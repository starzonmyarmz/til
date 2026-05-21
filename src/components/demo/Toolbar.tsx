import type { ReactNode } from 'react';

export default function Toolbar({ children }: { children: ReactNode }) {
  return <div className="toolbar">{children}</div>;
}

export function Spacer() {
  return <span className="spacer" />;
}
