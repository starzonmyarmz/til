import { useEffect, useRef, useState } from 'react';
import { Demo, Toolbar, Button, Console, Hint, type ConsoleLine } from '../../../components/demo';

export default function BackdropClickDemo() {
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

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    const isBackdrop = target === ref.current;
    append(
      `click target: <${target.tagName.toLowerCase()}> · ${isBackdrop ? 'backdrop' : 'inside content'}`,
      isBackdrop ? 'good' : 'warn'
    );
    if (isBackdrop) setIsOpen(false);
  };

  return (
    <Demo>
      <Toolbar>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open
        </Button>
      </Toolbar>

      <dialog
        ref={ref}
        onClick={handleClick}
        onCancel={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 8,
          padding: 24,
          maxWidth: 320,
          fontFamily: 'inherit',
        }}
      >
        <p style={{ margin: '0 0 12px' }}>Click anywhere — inside the box or on the backdrop.</p>
        <input
          type="text"
          defaultValue="click me"
          style={{
            font: 'inherit',
            padding: '4px 6px',
            border: '1px solid var(--rule)',
            borderRadius: 4,
          }}
        />
      </dialog>

      <Console lines={log} placeholder="Open the dialog, then click around" />

      <Hint>
        Notice that clicking the input, the text, or any other child reports a different target
        than clicking on the grey area around the dialog box.
      </Hint>
    </Demo>
  );
}
