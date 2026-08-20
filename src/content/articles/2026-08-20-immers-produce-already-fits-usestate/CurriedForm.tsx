import { useState } from "react";
import { produce } from "immer";
import {
  Demo,
  Toolbar,
  Button,
  Output,
  OutputRow,
  Badge,
  Hint,
} from "../../../components/demo";

export default function CurriedForm() {
  const [state, setState] = useState({ count: 0 });
  const [lastMode, setLastMode] = useState<"direct" | "curried" | null>(null);

  function doubleIncrementDirect() {
    const base = state; // the value this render closed over
    setState(
      produce(base, (draft) => {
        draft.count += 1;
      }),
    );
    setState(
      produce(base, (draft) => {
        draft.count += 1;
      }),
    );
    setLastMode("direct");
  }

  function doubleIncrementCurried() {
    setState(
      produce((draft) => {
        draft.count += 1;
      }),
    );
    setState(
      produce((draft) => {
        draft.count += 1;
      }),
    );
    setLastMode("curried");
  }

  function reset() {
    setState({ count: 0 });
    setLastMode(null);
  }

  return (
    <Demo>
      <Toolbar>
        <Button onClick={doubleIncrementDirect}>+1 twice (direct form)</Button>
        <Button onClick={doubleIncrementCurried}>
          +1 twice (curried form)
        </Button>
        <Button onClick={reset}>Reset</Button>
      </Toolbar>
      <Output>
        <OutputRow label="count">{state.count}</OutputRow>
        <OutputRow label="last call">
          {lastMode ? (
            <Badge tone={lastMode === "curried" ? "good" : "warn"}>
              {lastMode}
            </Badge>
          ) : (
            "—"
          )}
        </OutputRow>
      </Output>
      <Hint>
        The direct form computes the next value from the state captured earlier
        in this function, so calling it twice before a re-render happens starts
        from the same base both times — count only goes up by one. The curried
        form hands React a function instead of a value; React applies each one
        to the real, just-updated state in turn, so count goes up by two.
      </Hint>
    </Demo>
  );
}
