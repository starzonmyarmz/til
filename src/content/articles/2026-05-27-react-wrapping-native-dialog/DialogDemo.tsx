import { useEffect, useRef, useState } from 'react';
import { Demo, Toolbar, Button, Console, type ConsoleLine } from '../../../components/demo';

export default function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [log, setLog] = useState<ConsoleLine[]>([]);
  const ref = useRef<HTMLDialogElement>(null);

  const append = (line: string, tone: ConsoleLine['tone'] = 'info') =>
    setLog((prev) => [...prev.slice(-5), { line, tone }]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  const close = (reason: string) => {
    append(`close via ${reason}`, 'good');
    setIsOpen(false);
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    close('Esc (cancel event)');
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === ref.current) close('backdrop click');
  };

  return (
    <Demo>
      <Toolbar>
        <Button
          variant="primary"
          onClick={() => {
            append('open via showModal()', 'info');
            setIsOpen(true);
          }}
        >
          Open dialog
        </Button>
      </Toolbar>

      <dialog
        ref={ref}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 8,
          padding: 0,
          maxWidth: 360,
          fontFamily: 'inherit',
        }}
      >
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--rule)' }}>
          <strong>Export transactions</strong>
        </div>
        <div style={{ padding: 16 }}>
          <p style={{ margin: 0 }}>Click the backdrop, press Esc, or use the buttons below.</p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
            padding: 12,
            borderTop: '1px solid var(--rule)',
          }}
        >
          <Button onClick={() => close('Cancel button')}>Cancel</Button>
          <Button variant="primary" onClick={() => close('Download button')}>
            Download
          </Button>
        </div>
      </dialog>

      <Console lines={log} placeholder="Open the dialog to see close events" />
    </Demo>
  );
}
