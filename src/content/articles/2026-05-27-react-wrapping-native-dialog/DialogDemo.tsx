import { useState } from 'react';
import { Demo, Toolbar, Button, Console, NativeDialog, useConsoleLog } from '../../../components/demo';

export default function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const { lines, push } = useConsoleLog(6);

  const close = (reason: string) => {
    push(`close via ${reason}`, 'good');
    setIsOpen(false);
  };

  return (
    <Demo>
      <Toolbar>
        <Button
          variant="primary"
          onClick={() => {
            push('open via showModal()', 'info');
            setIsOpen(true);
          }}
        >
          Open dialog
        </Button>
      </Toolbar>

      <NativeDialog
        open={isOpen}
        onOpenChange={() => close('Esc (cancel event)')}
        onBackdropClick={() => close('backdrop click')}
        maxWidth={360}
        padding={0}
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
      </NativeDialog>

      <Console lines={lines} placeholder="Open the dialog to see close events" />
    </Demo>
  );
}
