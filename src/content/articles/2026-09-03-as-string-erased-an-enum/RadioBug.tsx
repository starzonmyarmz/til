import { useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Output,
  OutputRow,
  Badge,
  Hint,
} from "../../../components/demo";

enum ReasonCode {
  SignatureMissing = "Signature is missing",
  Expired = "Certificate is expired",
  Other = "Other",
}

const REASONS = Object.values(ReasonCode);

type Mode = "buggy" | "fixed";

export default function RadioBug() {
  const [mode, setMode] = useState<Mode>("buggy");
  const [selected, setSelected] = useState<string>(REASONS[0]);
  const [otherText, setOtherText] = useState("");

  function switchMode(next: Mode) {
    setMode(next);
    setSelected(REASONS[0]);
    setOtherText("");
  }

  const isOther = (reason: string) => reason === ReasonCode.Other;

  function isChecked(reason: string) {
    if (mode === "fixed") return selected === reason;
    // buggy: the Other row's value is the typed text, not ReasonCode.Other,
    // so checked has to be patched with a second, unrelated comparison
    return selected === reason || (isOther(reason) && selected === otherText);
  }

  function selectReason(reason: string) {
    if (mode === "buggy") {
      setSelected(isOther(reason) ? otherText : reason);
    } else {
      setSelected(reason);
    }
  }

  function changeOtherText(text: string) {
    setOtherText(text);
    if (mode === "buggy") {
      setSelected(text);
    } else {
      setSelected(ReasonCode.Other);
    }
  }

  const checkedCount = REASONS.filter(isChecked).length;

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={mode}
          onChange={switchMode}
          options={[
            { value: "buggy", label: "Buggy (as string)" },
            { value: "fixed", label: "Fixed (enum)" },
          ]}
        />
      </Toolbar>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
          marginBottom: "1rem",
        }}
      >
        {REASONS.map((reason) => (
          <label
            key={reason}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0.6rem",
              fontFamily: "var(--mono)",
              fontSize: "0.9rem",
            }}
          >
            <input
              type="radio"
              checked={isChecked(reason)}
              onChange={() => selectReason(reason)}
            />
            {reason}
            {isOther(reason) && (
              <input
                type="text"
                value={otherText}
                placeholder="type another reason's exact text"
                onFocus={() => selectReason(ReasonCode.Other)}
                onChange={(e) => changeOtherText(e.target.value)}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "0.9rem",
                  background: "var(--bg-elev)",
                  border: "1px solid var(--rule)",
                  color: "var(--ink)",
                  padding: "0.25rem 0.5rem",
                  flex: 1,
                }}
              />
            )}
          </label>
        ))}
      </div>

      <Output>
        {REASONS.map((reason) => (
          <OutputRow key={reason} label={reason}>
            {isChecked(reason) ? "checked" : "—"}
          </OutputRow>
        ))}
      </Output>

      {checkedCount > 1 && (
        <Hint>
          <Badge tone="bad">{checkedCount} radios checked at once</Badge> — the
          typed text matched another option's exact label, and the buggy
          comparison can't tell the two apart.
        </Hint>
      )}
      {mode === "fixed" && (
        <Hint>
          Try the same text here — only the Other row ever checks, no matter
          what's typed.
        </Hint>
      )}
    </Demo>
  );
}
