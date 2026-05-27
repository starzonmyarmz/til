import { useEffect, useRef, useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Button, Hint } from '../../../components/demo';

type Mode = 'open' | 'showModal';

export default function OpenVsShowModalDemo() {
  const [mode, setMode] = useState<Mode>('showModal');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!isOpen) {
      if (dialog.open) dialog.close();
      return;
    }
    if (mode === 'showModal') {
      if (!dialog.open) dialog.showModal();
    } else {
      if (!dialog.open) dialog.setAttribute('open', '');
    }
  }, [isOpen, mode]);

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={mode}
          onChange={(v) => {
            setIsOpen(false);
            setMode(v as Mode);
          }}
          options={[
            { value: 'showModal', label: 'showModal()' },
            { value: 'open', label: 'open attribute' },
          ]}
          variant="pill"
        />
        <Button onClick={() => setIsOpen((v) => !v)}>
          {isOpen ? 'Close' : 'Open'} dialog
        </Button>
      </Toolbar>

      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) setIsOpen(false);
        }}
        onCancel={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 8,
          padding: 16,
          maxWidth: 320,
          fontFamily: 'inherit',
        }}
      >
        <p style={{ margin: '0 0 8px' }}>
          Opened with <code style={{ fontFamily: 'var(--mono)' }}>{mode}</code>.
        </p>
        <p style={{ margin: '0 0 12px', color: 'var(--ink-soft)' }}>
          {mode === 'showModal'
            ? 'Backdrop visible. Esc closes. Focus trapped.'
            : 'No backdrop. Esc ignored. Background still focusable.'}
        </p>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </dialog>

      <Hint>
        The same element, two opening verbs. Only one of them is a modal in the sense that word
        usually means.
      </Hint>
    </Demo>
  );
}
