import { useState } from "react";
import {
  Demo,
  Slider,
  Output,
  OutputRow,
  Hint,
} from "../../../components/demo";

function basisFor(width: number) {
  if (width >= 1024) return 33.333;
  if (width >= 768) return 45;
  if (width >= 480) return 60;
  return 85;
}

export default function ResponsiveBreakpointDemo() {
  const [width, setWidth] = useState(360);
  const basis = basisFor(width);
  const cardWidth = (width * basis) / 100;

  return (
    <Demo>
      <Slider
        label="Simulated viewport width"
        min={320}
        max={1200}
        step={10}
        value={width}
        onChange={setWidth}
        format={(value) => `${value}px`}
      />
      <Output>
        <OutputRow label="flex-basis:">{basis}%</OutputRow>
        <OutputRow label="card width:">{Math.round(cardWidth)}px</OutputRow>
      </Output>
      <div
        style={{
          width: `${width}px`,
          maxWidth: "100%",
          display: "flex",
          gap: "0.5rem",
          overflow: "hidden",
          border: "1px solid var(--rule)",
          padding: "0.5rem",
          margin: "0.75rem 0",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${basis}%`,
              maxWidth: `${basis}%`,
              height: "4rem",
              border: "1px solid var(--rule)",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--mono)",
              color: "var(--ink-soft)",
              flexShrink: 0,
            }}
          >
            card {i + 1}
          </div>
        ))}
      </div>
      <Hint>
        Below 480px one card fills most of the row with a peek of the next. At
        1024px and up, three cards fit evenly.
      </Hint>
    </Demo>
  );
}
