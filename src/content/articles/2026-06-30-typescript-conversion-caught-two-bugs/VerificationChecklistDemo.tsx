import { useState } from "react";
import { Demo, Toolbar, Button, Console } from "../../../components/demo";
import type { ConsoleLine } from "../../../components/demo";

const CHECKS: ConsoleLine[] = [
  { line: "$ lint -- 0 problems", tone: "good" },
  { line: "$ tsc --noEmit -- 0 errors", tone: "good" },
  { line: "$ test -- 16 passed", tone: "good" },
  { line: "$ open in a browser tab and type a search query...", tone: "info" },
  {
    line: "GET /search?... net::ERR_INSUFFICIENT_RESOURCES (repeating)",
    tone: "bad",
  },
];

export default function VerificationChecklistDemo() {
  const [shown, setShown] = useState(0);
  const done = shown >= CHECKS.length;

  return (
    <Demo>
      <Toolbar>
        <Button
          onClick={() => setShown((s) => Math.min(s + 1, CHECKS.length))}
          disabled={done}
        >
          {done ? "Done" : "Run next check"}
        </Button>
        <Button onClick={() => setShown(0)}>Reset</Button>
      </Toolbar>
      <Console
        lines={CHECKS.slice(0, shown)}
        placeholder="click through the checklist"
      />
    </Demo>
  );
}
