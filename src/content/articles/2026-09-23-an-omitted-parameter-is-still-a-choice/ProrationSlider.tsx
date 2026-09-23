import { useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Slider,
  Output,
  OutputRow,
  Badge,
  Hint,
} from "../../../components/demo";

type Behavior = "omitted" | "create_prorations" | "always_invoice" | "none";

const CYCLE_DAYS = 30;

const money = (cents: number) => {
  const sign = cents < 0 ? "-" : "";
  return `${sign}$${(Math.abs(cents) / 100).toFixed(2)}`;
};

export default function ProrationSlider() {
  const [day, setDay] = useState(15);
  const [oldPrice, setOldPrice] = useState(20);
  const [newPrice, setNewPrice] = useState(50);
  const [behavior, setBehavior] = useState<Behavior>("omitted");

  const effective = behavior === "omitted" ? "create_prorations" : behavior;
  const remaining = (CYCLE_DAYS - day) / CYCLE_DAYS;
  const credit = -Math.round(oldPrice * 100 * remaining);
  const charge = Math.round(newPrice * 100 * remaining);
  const prorates = effective !== "none";

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          variant="pill"
          value={behavior}
          onChange={setBehavior}
          options={[
            { value: "omitted", label: "(key omitted)" },
            { value: "create_prorations", label: "create_prorations" },
            { value: "always_invoice", label: "always_invoice" },
            { value: "none", label: "none" },
          ]}
        />
      </Toolbar>
      <Slider
        label="change on day"
        min={0}
        max={CYCLE_DAYS}
        step={1}
        value={day}
        onChange={setDay}
        format={(v) => `${v} / ${CYCLE_DAYS}`}
      />
      <Slider
        label="old price"
        min={0}
        max={100}
        step={5}
        value={oldPrice}
        onChange={setOldPrice}
        format={(v) => `$${v}/mo`}
      />
      <Slider
        label="new price"
        min={0}
        max={100}
        step={5}
        value={newPrice}
        onChange={setNewPrice}
        format={(v) => `$${v}/mo`}
      />
      <Output>
        <OutputRow label="effective:">
          <Badge tone={prorates ? "warn" : "good"}>{effective}</Badge>
          {behavior === "omitted" ? " (server default)" : ""}
        </OutputRow>
        <OutputRow label="unused old:">
          {prorates ? money(credit) : "—"}
        </OutputRow>
        <OutputRow label="remaining new:">
          {prorates ? money(charge) : "—"}
        </OutputRow>
        <OutputRow label="net adjustment:">
          <span data-tone={prorates && credit + charge !== 0 ? "warn" : "good"}>
            {prorates ? money(credit + charge) : "$0.00"}
          </span>
        </OutputRow>
        <OutputRow label="when billed:">
          {effective === "none"
            ? "nothing extra; next invoice at new price"
            : effective === "always_invoice"
              ? "invoice created immediately"
              : "pending items on next invoice"}
        </OutputRow>
      </Output>
      <Hint>
        Simplified day-based math for illustration. Leaving the key out behaves
        exactly like create_prorations.
      </Hint>
    </Demo>
  );
}
