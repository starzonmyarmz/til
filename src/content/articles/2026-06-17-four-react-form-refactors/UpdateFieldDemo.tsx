import React, { useState } from "react";
import {
  Demo,
  Console,
  Output,
  OutputRow,
  Toolbar,
  ToggleGroup,
  Hint,
} from "../../../components/demo";

type ConsoleLine = { line: string; tone: "info" | "good" | "warn" | "bad" };

type FormValues = {
  name: string;
  churchCenterEnabled: boolean;
  geolocationSetManually: boolean;
  latitude: string;
  zip: string;
};

const initial: FormValues = {
  name: "Main Campus",
  churchCenterEnabled: true,
  geolocationSetManually: false,
  latitude: "",
  zip: "",
};

type Approach = "any" | "generic";

export default function UpdateFieldDemo() {
  const [approach, setApproach] = useState<Approach>("any");
  const [form, setForm] = useState<FormValues>({ ...initial });
  const [log, setLog] = useState<ConsoleLine[]>([
    {
      line: "try the calls below — generic version catches type mismatches",
      tone: "info",
    },
  ]);

  // Typed only with `any` — no compile-time safety (simulated at runtime here)
  const updateFieldAny = (field: string, value: unknown) => {
    const expected = typeof initial[field as keyof FormValues];
    const actual = typeof value;
    if (expected !== actual) {
      setLog((prev) => [
        ...prev.slice(-8),
        {
          line: `updateField("${field}", ${JSON.stringify(value)}) → runtime error caught: expected ${expected}, got ${actual}`,
          tone: "bad",
        },
      ]);
      return;
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    setLog((prev) => [
      ...prev.slice(-8),
      {
        line: `updateField("${field}", ${JSON.stringify(value)}) → ok`,
        tone: "good",
      },
    ]);
  };

  // Generic constrained version
  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setLog((prev) => [
      ...prev.slice(-8),
      {
        line: `updateField("${field}", ${JSON.stringify(value)}) → ok`,
        tone: "good",
      },
    ]);
  };

  const calls: Array<{ label: string; valid: boolean; run: () => void }> = [
    {
      label: 'updateField("name", "East Campus")  ✓',
      valid: true,
      run: () =>
        approach === "generic"
          ? updateField("name", "East Campus")
          : updateFieldAny("name", "East Campus"),
    },
    {
      label: 'updateField("churchCenterEnabled", false)  ✓',
      valid: true,
      run: () =>
        approach === "generic"
          ? updateField("churchCenterEnabled", false)
          : updateFieldAny("churchCenterEnabled", false),
    },
    {
      label: 'updateField("churchCenterEnabled", "yes")  ✗ wrong type',
      valid: false,
      run: () =>
        approach === "generic"
          ? // @ts-expect-error intentional demo of type error
            updateField("churchCenterEnabled", "yes")
          : updateFieldAny("churchCenterEnabled", "yes"),
    },
    {
      label:
        'updateField("geolocationSetManually", "true")  ✗ string not boolean',
      valid: false,
      run: () =>
        approach === "generic"
          ? // @ts-expect-error intentional demo of type error
            updateField("geolocationSetManually", "true")
          : updateFieldAny("geolocationSetManually", "true"),
    },
    {
      label: 'updateField("zip", "92024")  ✓',
      valid: true,
      run: () =>
        approach === "generic"
          ? updateField("zip", "92024")
          : updateFieldAny("zip", "92024"),
    },
  ];

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={approach}
          onChange={(v) => {
            setApproach(v as Approach);
            setForm({ ...initial });
            setLog([
              { line: "switched approach — try the calls", tone: "info" },
            ]);
          }}
          options={[
            { value: "any", label: "(field: string, value: any)" },
            { value: "generic", label: "<K extends keyof FormValues>" },
          ]}
        />
      </Toolbar>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {calls.map((c) => (
          <button
            key={c.label}
            onClick={c.run}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              padding: "5px 10px",
              textAlign: "left",
              background: c.valid
                ? "var(--bg-elev)"
                : "color-mix(in srgb, var(--tone-bad) 8%, var(--bg-elev))",
              border: `1px solid ${c.valid ? "var(--rule)" : "color-mix(in srgb, var(--tone-bad) 30%, var(--rule))"}`,
              borderRadius: 4,
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Output>
        <OutputRow label="name:">{form.name}</OutputRow>
        <OutputRow label="churchCenterEnabled:">
          {String(form.churchCenterEnabled)}
        </OutputRow>
        <OutputRow label="geolocationSetManually:">
          {String(form.geolocationSetManually)}
        </OutputRow>
        <OutputRow label="zip:">{form.zip || "—"}</OutputRow>
      </Output>

      <Console lines={log} />

      <Hint>
        With the generic signature, the wrong-type calls are compile errors in
        TypeScript — the editor underlines them before the code ever runs. The
        any version only catches mismatches at runtime (simulated here).
      </Hint>
    </Demo>
  );
}
