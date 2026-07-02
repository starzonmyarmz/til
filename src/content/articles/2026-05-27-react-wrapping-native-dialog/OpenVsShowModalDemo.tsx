import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Button, Hint, NativeDialog } from '../../../components/demo';

type Mode = 'open' | 'showModal';

export default function OpenVsShowModalDemo() {
  const [mode, setMode] = useState<Mode>('showModal');
  const [isOpen, setIsOpen] = useState(false);

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

      <NativeDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onBackdropClick={() => setIsOpen(false)}
        mode={mode}
        padding={16}
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
      </NativeDialog>

      <Hint>
        The same element, two opening verbs. Only one of them is a modal in the sense that word
        usually means.
      </Hint>
    </Demo>
  );
}
