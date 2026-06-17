import React, { useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Output,
  OutputRow,
  Hint,
} from "../../../components/demo";

type Approach = "scattered" | "unified";

const FIELDS = ["name", "street", "city", "zip", "country"] as const;
type Field = (typeof FIELDS)[number];

type FormValues = Record<Field, string>;

const initial: FormValues = {
  name: "",
  street: "",
  city: "",
  zip: "",
  country: "",
};

function ScatteredForm() {
  const [name, setName] = useState(initial.name);
  const [street, setStreet] = useState(initial.street);
  const [city, setCity] = useState(initial.city);
  const [zip, setZip] = useState(initial.zip);
  const [country, setCountry] = useState(initial.country);

  const renderCount = useRenderCount();

  const setters: Record<Field, (v: string) => void> = {
    name: setName,
    street: setStreet,
    city: setCity,
    zip: setZip,
    country: setCountry,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Output grid={false}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            color: "var(--ink-soft)",
          }}
        >
          render #{renderCount}
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 12px",
            marginTop: 8,
          }}
        >
          {FIELDS.map((f) => (
            <label key={f} style={{ display: "contents" }}>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  alignSelf: "center",
                }}
              >
                {f}
              </span>
              <input
                value={{ name, street, city, zip, country }[f]}
                onChange={(e) => setters[f](e.target.value)}
                placeholder={f}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  padding: "4px 8px",
                  background: "var(--bg)",
                  border: "1px solid var(--rule)",
                  borderRadius: 4,
                  color: "var(--ink)",
                }}
              />
            </label>
          ))}
        </div>
      </Output>
      <Hint>
        5 separate useState hooks. Each keystroke triggers the same single
        re-render, but the state is fragmented across 5 setters.
      </Hint>
    </div>
  );
}

function UnifiedForm() {
  const [form, setForm] = useState<FormValues>(() => ({ ...initial }));
  const renderCount = useRenderCount();

  const updateField = (field: Field, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Output grid={false}>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 13,
            color: "var(--ink-soft)",
          }}
        >
          render #{renderCount}
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 12px",
            marginTop: 8,
          }}
        >
          {FIELDS.map((f) => (
            <label key={f} style={{ display: "contents" }}>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: "var(--ink-soft)",
                  alignSelf: "center",
                }}
              >
                {f}
              </span>
              <input
                value={form[f]}
                onChange={(e) => updateField(f, e.target.value)}
                placeholder={f}
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  padding: "4px 8px",
                  background: "var(--bg)",
                  border: "1px solid var(--rule)",
                  borderRadius: 4,
                  color: "var(--ink)",
                }}
              />
            </label>
          ))}
        </div>
      </Output>
      <Hint>
        One form object, one updateField helper. Same render count — the benefit
        is structural clarity and a single FormValues type for TypeScript.
      </Hint>
    </div>
  );
}

function useRenderCount() {
  const ref = React.useRef(0);
  ref.current += 1;
  return ref.current;
}

export default function FormStateDemo() {
  const [approach, setApproach] = useState<Approach>("scattered");

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={approach}
          onChange={(v) => setApproach(v as Approach)}
          options={[
            { value: "scattered", label: "11 useState hooks" },
            { value: "unified", label: "One form object" },
          ]}
        />
      </Toolbar>
      {approach === "scattered" ? (
        <ScatteredForm key="s" />
      ) : (
        <UnifiedForm key="u" />
      )}
    </Demo>
  );
}
