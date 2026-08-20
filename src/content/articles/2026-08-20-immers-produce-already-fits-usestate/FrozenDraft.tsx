import { useState } from "react";
import { produce } from "immer";
import {
  Demo,
  Toolbar,
  Button,
  Console,
  useConsoleLog,
  Hint,
} from "../../../components/demo";

type Counter = { count: number };

function freeze(value: Counter): Counter {
  return Object.freeze(value) as Counter;
}

export default function FrozenDraft() {
  const [state, setState] = useState<Counter>(() => freeze({ count: 0 }));
  const { lines, push, reset: resetLog } = useConsoleLog();

  function tryDirectMutation() {
    try {
      state.count += 1;
      push(`direct mutation succeeded, count is now ${state.count}`, "good");
    } catch (e) {
      push(`direct mutation threw: ${(e as Error).message}`, "bad");
    }
  }

  function tryProduce() {
    try {
      const next = produce(state, (draft) => {
        draft.count += 1;
      });
      setState(freeze(next));
      push(`produce succeeded, count is now ${next.count}`, "good");
    } catch (e) {
      push(`produce threw: ${(e as Error).message}`, "bad");
    }
  }

  function reset() {
    setState(freeze({ count: 0 }));
    resetLog();
  }

  return (
    <Demo>
      <Toolbar>
        <Button onClick={tryDirectMutation}>Try direct mutation</Button>
        <Button onClick={tryProduce}>Try produce</Button>
        <Button onClick={reset}>Reset</Button>
      </Toolbar>
      <Console
        lines={lines}
        placeholder="// state.count is frozen at 0 — try mutating it"
      />
      <Hint>
        Immer builds a proxy-backed draft over the base value and only ever
        writes into that draft, never into the original object — so it works
        even when the original is frozen. Direct property assignment has no such
        buffer. Inside a module, which runs in strict mode by default, writing
        to a frozen object throws instead of silently doing nothing.
      </Hint>
    </Demo>
  );
}
