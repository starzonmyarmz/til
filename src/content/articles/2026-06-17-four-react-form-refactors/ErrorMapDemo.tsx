import React, { useMemo, useState } from "react";
import {
  Demo,
  Toolbar,
  ToggleGroup,
  Slider,
  Console,
  Hint,
} from "../../../components/demo";

type Approach = "naive" | "map";

type ApiError = { source: { parameter: string }; detail: string };

const FIELDS = [
  "name",
  "street",
  "city",
  "zip",
  "country",
  "state",
  "timeZone",
  "latitude",
  "longitude",
  "geolocation",
];

function makeErrors(count: number): ApiError[] {
  return FIELDS.slice(0, count).map((f) => ({
    source: { parameter: f },
    detail: "is invalid",
  }));
}

type ConsoleLine = { line: string; tone: "info" | "good" | "warn" | "bad" };

function runNaive(errors: ApiError[]): ConsoleLine[] {
  const lines: ConsoleLine[] = [];
  let scans = 0;

  const hasApiError = (property: string) => {
    const propsArray = errors.map((e) => e.source.parameter); // scan #1
    scans++;
    return propsArray.indexOf(property) >= 0;
  };

  const apiErrorText = (property: string) => {
    if (!hasApiError(property)) return undefined; // scan #2 (via hasApiError)
    const index = errors.map((e) => e.source.parameter).indexOf(property); // scan #3
    scans++;
    const error = errors[index];
    return `${property.charAt(0).toUpperCase()}${property.slice(1)} ${error.detail}`;
  };

  FIELDS.forEach((f) => {
    const has = hasApiError(f);
    const text = apiErrorText(f);
    lines.push({
      line: `${f}: invalid=${has} text="${text ?? "—"}"`,
      tone: has ? "warn" : "info",
    });
  });

  lines.push({
    line: `total array scans: ${scans}`,
    tone: scans > 5 ? "bad" : "good",
  });
  return lines;
}

function runMap(errors: ApiError[]): ConsoleLine[] {
  const lines: ConsoleLine[] = [];
  let mapBuilds = 0;

  const errorsByParam = new Map(
    errors.map((e) => [e.source.parameter, e.detail]),
  );
  mapBuilds++;

  const hasApiError = (property: string) => errorsByParam.has(property);
  const apiErrorText = (property: string) => {
    const detail = errorsByParam.get(property);
    if (!detail) return undefined;
    return `${property.charAt(0).toUpperCase()}${property.slice(1)} ${detail}`;
  };

  FIELDS.forEach((f) => {
    const has = hasApiError(f);
    const text = apiErrorText(f);
    lines.push({
      line: `${f}: invalid=${has} text="${text ?? "—"}"`,
      tone: has ? "warn" : "info",
    });
  });

  lines.push({
    line: `map builds: ${mapBuilds} (vs ${FIELDS.length * 2}+ array scans)`,
    tone: "good",
  });
  return lines;
}

export default function ErrorMapDemo() {
  const [approach, setApproach] = useState<Approach>("naive");
  const [errorCount, setErrorCount] = useState(3);

  const errors = useMemo(() => makeErrors(errorCount), [errorCount]);
  const lines = approach === "naive" ? runNaive(errors) : runMap(errors);

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={approach}
          onChange={(v) => setApproach(v as Approach)}
          options={[
            { value: "naive", label: "Repeated array scans" },
            { value: "map", label: "useMemo Map" },
          ]}
        />
        <Slider
          label="errors"
          min={0}
          max={FIELDS.length}
          step={1}
          value={errorCount}
          onChange={setErrorCount}
        />
      </Toolbar>
      <Console lines={lines} />
      <Hint>
        The naive approach re-scans apiErrors on every hasApiError and
        apiErrorText call — two scans per field minimum. The Map is built once;
        every lookup after is O(1).
      </Hint>
    </Demo>
  );
}
