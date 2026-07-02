import { useState } from "react";
import {
  Demo,
  Toolbar,
  Spacer,
  Button,
  ToggleGroup,
  Console,
  useConsoleLog,
} from "../../../components/demo";
import type { ConsoleLine } from "../../../components/demo";

type Config = "wrong" | "fixed";

function showDialog(options: { onConfirm?: () => void }) {
  options.onConfirm?.();
}

export default function ExcessPropertyDemo() {
  const [config, setConfig] = useState<Config>("wrong");
  const { lines, push, reset } = useConsoleLog();

  const diagnostic: ConsoleLine =
    config === "wrong"
      ? {
          line: `Object literal may only specify known properties, but 'confirm' does not exist. Did you mean 'onConfirm'?`,
          tone: "bad",
        }
      : { line: "type-checks: 0 errors", tone: "good" };

  function clickProceed() {
    let fired = false;
    const options: { onConfirm?: () => void; confirm?: () => void } =
      config === "wrong"
        ? { confirm: () => (fired = true) }
        : { onConfirm: () => (fired = true) };
    showDialog(options);
    push(
      fired
        ? "onConfirm fired -- action confirmed"
        : "nothing happened -- showDialog only reads onConfirm",
      fired ? "good" : "bad",
    );
  }

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={config}
          onChange={(next) => {
            setConfig(next);
            reset();
          }}
          options={[
            { value: "wrong", label: "confirm: () => ..." },
            { value: "fixed", label: "onConfirm: () => ..." },
          ]}
        />
        <Spacer />
        <Button onClick={clickProceed}>Click Proceed</Button>
      </Toolbar>
      <Console
        lines={[diagnostic, ...lines]}
        placeholder="pick a config and click Proceed"
      />
    </Demo>
  );
}
