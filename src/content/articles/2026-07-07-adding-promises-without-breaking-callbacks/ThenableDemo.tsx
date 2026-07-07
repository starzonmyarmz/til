import { useRef, useState } from "react";
import {
  Demo,
  Toolbar,
  Button,
  Badge,
  Console,
  useConsoleLog,
} from "../../../components/demo";

type Instance = Promise<string> & { close: () => void };

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function makeInstance(): Instance {
  const { promise, resolve } = deferred<string>();
  return Object.assign(promise, {
    close: () => resolve("closed via .close()"),
  });
}

export default function ThenableDemo() {
  const [exists, setExists] = useState(false);
  const { lines, push, reset } = useConsoleLog(6);
  const instanceRef = useRef<Instance | null>(null);

  const createInstance = () => {
    reset();
    instanceRef.current = makeInstance();
    setExists(true);
    push("new instance created — one object, both APIs", "info");
  };

  const callClose = () => {
    push("calling instance.close() (a plain method)", "warn");
    instanceRef.current?.close();
  };

  const awaitInstance = async () => {
    if (!instanceRef.current) return;
    push("awaiting the same instance...", "info");
    const result = await instanceRef.current;
    push(`await resolved with: "${result}"`, "good");
  };

  return (
    <Demo>
      <Toolbar>
        <Button onClick={createInstance}>New instance</Button>
        {exists && <Badge tone="good">same object below</Badge>}
      </Toolbar>

      <Toolbar>
        <Button onClick={callClose} disabled={!exists}>
          instance.close()
        </Button>
        <Button onClick={awaitInstance} disabled={!exists}>
          await instance
        </Button>
      </Toolbar>

      <Console
        lines={lines}
        placeholder="// click New instance, then try both buttons"
      />
    </Demo>
  );
}
