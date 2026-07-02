import React, { useRef, useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Console,
  Hint,
  useConsoleLog,
} from "../../../components/demo";

type Approach = "inline" | "hoisted";

// --- HOISTED version: defined once at module level ---
const HoistedContent = ({ label }: { label: string }) => (
  <span>
    Dialog content for: <strong>{label}</strong>
  </span>
);

export default function HoistDemo() {
  const [approach, setApproach] = useState<Approach>("inline");
  const { lines, push, reset } = useConsoleLog(10);
  const clickCount = useRef(0);
  const typeRefs = useRef<Set<unknown>>(new Set());

  const handleInlineClick = () => {
    clickCount.current += 1;

    // Defined inside the handler — new function reference every click
    const InlineContent = ({ label }: { label: string }) => (
      <span>
        Dialog content for: <strong>{label}</strong>
      </span>
    );

    const isNew = !typeRefs.current.has(InlineContent);
    typeRefs.current.add(InlineContent);

    push(
      `click #${clickCount.current}: component type is ${isNew ? "NEW (forced remount)" : "same"}`,
      isNew ? "bad" : "good",
    );
  };

  const handleHoistedClick = () => {
    clickCount.current += 1;
    const isNew = !typeRefs.current.has(HoistedContent);
    typeRefs.current.add(HoistedContent);

    push(
      `click #${clickCount.current}: component type is ${isNew ? "new (first mount)" : "SAME (stable ref ✓)"}`,
      isNew ? "info" : "good",
    );
  };

  const handleReset = () => {
    clickCount.current = 0;
    typeRefs.current = new Set();
    reset();
  };

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={approach}
          onChange={(v) => {
            setApproach(v as Approach);
            handleReset();
          }}
          options={[
            { value: "inline", label: "Defined in handler" },
            { value: "hoisted", label: "Hoisted to module" },
          ]}
        />
        <button
          onClick={
            approach === "inline" ? handleInlineClick : handleHoistedClick
          }
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            padding: "4px 12px",
            background: "var(--bg-elev)",
            border: "1px solid var(--rule)",
            borderRadius: 4,
            color: "var(--ink)",
            cursor: "pointer",
          }}
        >
          Open dialog
        </button>
      </Toolbar>
      <Console
        lines={
          lines.length
            ? lines
            : [
                {
                  line: 'click "Open dialog" to trace component identity',
                  tone: "info",
                },
              ]
        }
      />
      <Hint>
        Every call to the inline handler creates a new function, so React sees a
        new component type and forces a remount. The hoisted component has a
        stable identity — React reconciles normally.
      </Hint>
    </Demo>
  );
}
