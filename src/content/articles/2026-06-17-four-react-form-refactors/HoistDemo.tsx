import React, { useRef, useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Console,
  Hint,
} from "../../../components/demo";

type Approach = "inline" | "hoisted";
type ConsoleLine = { line: string; tone: "info" | "good" | "warn" | "bad" };

// --- HOISTED version: defined once at module level ---
const HoistedContent = ({ label }: { label: string }) => (
  <span>
    Dialog content for: <strong>{label}</strong>
  </span>
);

export default function HoistDemo() {
  const [approach, setApproach] = useState<Approach>("inline");
  const [log, setLog] = useState<ConsoleLine[]>([]);
  const clickCount = useRef(0);
  const typeRefs = useRef<Set<unknown>>(new Set());

  const addLine = (line: string, tone: ConsoleLine["tone"] = "info") =>
    setLog((prev) => [...prev.slice(-9), { line, tone }]);

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

    addLine(
      `click #${clickCount.current}: component type is ${isNew ? "NEW (forced remount)" : "same"}`,
      isNew ? "bad" : "good",
    );
  };

  const handleHoistedClick = () => {
    clickCount.current += 1;
    const isNew = !typeRefs.current.has(HoistedContent);
    typeRefs.current.add(HoistedContent);

    addLine(
      `click #${clickCount.current}: component type is ${isNew ? "new (first mount)" : "SAME (stable ref ✓)"}`,
      isNew ? "info" : "good",
    );
  };

  const handleReset = () => {
    clickCount.current = 0;
    typeRefs.current = new Set();
    setLog([]);
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
          log.length
            ? log
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
