import { useRef, useState } from "react";
import {
  Demo,
  Toolbar,
  Button,
  Slider,
  Output,
  OutputRow,
  Console,
  useConsoleLog,
} from "../../../components/demo";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

type Status = "idle" | "pending" | "resolved";

export default function DeferredDemo() {
  const [delay, setDelay] = useState(1200);
  const [status, setStatus] = useState<Status>("idle");
  const [value, setValue] = useState<string | null>(null);
  const { lines, push, reset } = useConsoleLog(6);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = () => {
    reset();
    setStatus("pending");
    setValue(null);

    const { promise, resolve } = deferred<string>();
    push(
      "new Promise(executor) ran — resolve captured, nothing else happened yet",
      "info",
    );

    timerRef.current = setTimeout(() => {
      push(
        `setTimeout fired after ${delay}ms — calling the captured resolve()`,
        "warn",
      );
      resolve(`resolved after ${delay}ms`);
    }, delay);

    promise.then((result) => {
      push("await unblocked with the resolved value", "good");
      setStatus("resolved");
      setValue(result);
    });
  };

  return (
    <Demo>
      <Toolbar>
        <Slider
          label="resolve after"
          min={200}
          max={3000}
          step={100}
          value={delay}
          onChange={setDelay}
          format={(v) => `${v}ms`}
        />
        <Button onClick={start}>Create + start</Button>
      </Toolbar>

      <Output>
        <OutputRow label="status">{status}</OutputRow>
        <OutputRow label="value">{value ?? "—"}</OutputRow>
      </Output>

      <Console lines={lines} placeholder="// click Create + start" />
    </Demo>
  );
}
