import type { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  children: ReactNode;
};

/**
 * Bordered mono panel for content that doesn't fit Output's label/value
 * grid — raw/parsed comparisons, code previews, free-form blocks. Pair with
 * PanelGrid to lay two or more side by side.
 */
export default function Panel({ title, children }: Props) {
  return (
    <div className="panel">
      {title && <div className="panel-title">{title}</div>}
      {children}
    </div>
  );
}
