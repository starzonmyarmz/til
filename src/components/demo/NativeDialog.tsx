import { useEffect, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackdropClick?: (e: MouseEvent<HTMLDialogElement>) => void;
  /** 'showModal' drives dialog.showModal()/close(); 'open' toggles the open attribute directly. Default 'showModal'. */
  mode?: 'showModal' | 'open';
  maxWidth?: number;
  /** Default 24. Set to 0 when the content manages its own padding (e.g. a header/body/footer layout). */
  padding?: number;
  children: ReactNode;
};

/**
 * Wraps a native <dialog>, syncing the imperative showModal()/close() API
 * (or the plain `open` attribute, via `mode="open"`) to a boolean prop so
 * demos don't each re-implement the ref + effect dance. Also wires up
 * backdrop-click detection (`e.target === the dialog itself`) for
 * onBackdropClick.
 */
export default function NativeDialog({
  open,
  onOpenChange,
  onBackdropClick,
  mode = 'showModal',
  maxWidth = 320,
  padding = 24,
  children,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || mode !== 'showModal') return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open, mode]);

  return (
    <dialog
      ref={ref}
      open={mode === 'open' ? open : undefined}
      onClick={(e) => {
        if (e.target === ref.current) onBackdropClick?.(e);
      }}
      onCancel={(e) => {
        e.preventDefault();
        onOpenChange(false);
      }}
      style={{
        border: '1px solid var(--rule)',
        borderRadius: 8,
        padding,
        maxWidth,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </dialog>
  );
}
