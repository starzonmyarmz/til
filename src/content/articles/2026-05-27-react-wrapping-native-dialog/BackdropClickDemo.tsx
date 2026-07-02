import { useState } from 'react';
import {
  Demo,
  Toolbar,
  Button,
  Console,
  Hint,
  NativeDialog,
  useConsoleLog,
} from '../../../components/demo';

export default function BackdropClickDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const { lines, push } = useConsoleLog(6);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    push(`click target: <${target.tagName.toLowerCase()}> · inside content`, 'warn');
  };

  const handleBackdropClick = () => {
    push('click target: <dialog> · backdrop', 'good');
    setIsOpen(false);
  };

  return (
    <Demo>
      <Toolbar>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open
        </Button>
      </Toolbar>

      <NativeDialog open={isOpen} onOpenChange={setIsOpen} onBackdropClick={handleBackdropClick}>
        <div onClick={handleContentClick}>
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
        </div>
      </NativeDialog>

      <Console lines={lines} placeholder="Open the dialog, then click around" />

      <Hint>
        Notice that clicking the input, the text, or any other child reports a different target
        than clicking on the grey area around the dialog box.
      </Hint>
    </Demo>
  );
}
