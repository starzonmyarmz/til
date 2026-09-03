import { useState } from "react";
import {
  Demo,
  Toolbar,
  Button,
  Spacer,
  Badge,
  Console,
  useConsoleLog,
} from "../../../components/demo";

type Version = "cast" | "enum";

export default function TestProof() {
  const { lines, push, reset } = useConsoleLog(6);
  const [lastResult, setLastResult] = useState<"pass" | "fail" | null>(null);

  function run(version: Version) {
    reset();
    push("> test: typed text matching a preset checks only one radio", "info");
    push('  type "Certificate is expired" into the Other field', "info");

    const bothChecked = version === "cast";
    push(
      `  expect(checkedRadios).toHaveLength(1) -- got ${bothChecked ? 2 : 1}`,
      bothChecked ? "bad" : "good",
    );
    push(bothChecked ? "  FAIL" : "  PASS", bothChecked ? "bad" : "good");
    setLastResult(bothChecked ? "fail" : "pass");
  }

  return (
    <Demo>
      <Toolbar>
        <Button onClick={() => run("cast")}>
          Run against the as string version
        </Button>
        <Button onClick={() => run("enum")}>
          Run against the enum version
        </Button>
        <Spacer />
        {lastResult && (
          <Badge tone={lastResult === "fail" ? "bad" : "good"}>
            {lastResult.toUpperCase()}
          </Badge>
        )}
      </Toolbar>
      <Console
        lines={lines}
        placeholder="// run the test against either version"
      />
    </Demo>
  );
}
