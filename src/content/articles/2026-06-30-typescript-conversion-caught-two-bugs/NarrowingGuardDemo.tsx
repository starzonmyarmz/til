import { useState } from "react";
import { Demo, Toolbar, Button, Console } from "../../../components/demo";
import type { ConsoleLine } from "../../../components/demo";

const STEPS: ConsoleLine[][] = [
  [
    {
      line: '// union: { id: string; email: string } | { id: "createNew"; query: string }',
      tone: "info",
    },
  ],
  [
    {
      line: 'if (item.id === "createNew") { openCreateForm(item.query) }',
      tone: "info",
    },
  ],
  [
    {
      line: `Property 'query' does not exist on type 'ListItem'.`,
      tone: "bad",
    },
    {
      line: "// id: string on the other branch is wide enough to not be excluded",
      tone: "bad",
    },
  ],
  [
    {
      line: "function isCreateNewOption(item): item is CreateNewOption { ... }",
      tone: "info",
    },
  ],
  [
    {
      line: "if (isCreateNewOption(item)) { openCreateForm(item.query) }",
      tone: "good",
    },
  ],
  [
    {
      line: "compiles -- item narrowed to CreateNewOption via the predicate",
      tone: "good",
    },
  ],
];

export default function NarrowingGuardDemo() {
  const [step, setStep] = useState(0);
  const lines = STEPS.slice(0, step + 1).flat();
  const atEnd = step >= STEPS.length - 1;

  return (
    <Demo>
      <Toolbar>
        <Button
          onClick={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
          disabled={atEnd}
        >
          {atEnd ? "Done" : "Next"}
        </Button>
        <Button onClick={() => setStep(0)}>Reset</Button>
      </Toolbar>
      <Console
        lines={lines}
        placeholder="click Next to step through the narrowing attempt"
      />
    </Demo>
  );
}
