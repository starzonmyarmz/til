import { useRef, useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Button,
  Console,
  useConsoleLog,
} from "../../../components/demo";

type Result = { isConfirmed: boolean; isDismissed: boolean };

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

type Mode = "callback" | "promise" | "both";

type DialogInstance = {
  confirmNow: () => void;
  cancelNow: () => void;
};

export default function DualApiDemo() {
  const [mode, setMode] = useState<Mode>("both");
  const [open, setOpen] = useState(false);
  const { lines, push, reset } = useConsoleLog(6);
  const instanceRef = useRef<DialogInstance | null>(null);

  const openDialog = () => {
    reset();
    const useCallbackApi = mode === "callback" || mode === "both";
    const usePromiseApi = mode === "promise" || mode === "both";

    const { promise, resolve } = deferred<Result>();

    const instance: DialogInstance = {
      confirmNow: () => {
        setOpen(false);
        if (useCallbackApi) push("onConfirm() fired", "good");
        resolve({ isConfirmed: true, isDismissed: false });
      },
      cancelNow: () => {
        setOpen(false);
        if (useCallbackApi) push("onCancel() fired", "warn");
        resolve({ isConfirmed: false, isDismissed: true });
      },
    };

    if (usePromiseApi) {
      promise.then((result) => {
        push(`promise resolved: ${JSON.stringify(result)}`, "info");
      });
    }

    instanceRef.current = instance;
    setOpen(true);
    push("dialog opened", "info");
  };

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={mode}
          onChange={setMode}
          variant="pill"
          options={[
            { value: "callback", label: "callback only" },
            { value: "promise", label: "promise only" },
            { value: "both", label: "both" },
          ]}
        />
      </Toolbar>

      <Toolbar>
        <Button onClick={openDialog}>Open dialog</Button>
        <Button
          onClick={() => instanceRef.current?.confirmNow()}
          disabled={!open}
        >
          Confirm
        </Button>
        <Button
          onClick={() => instanceRef.current?.cancelNow()}
          disabled={!open}
        >
          Cancel
        </Button>
      </Toolbar>

      <Console
        lines={lines}
        placeholder="// click Open dialog, then Confirm or Cancel"
      />
    </Demo>
  );
}
