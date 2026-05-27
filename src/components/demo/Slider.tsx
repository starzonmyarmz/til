import type { ReactNode } from 'react';

type Props = {
  label: ReactNode;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (next: number) => void;
  /** Optional formatter for the value readout on the right. Defaults to value.toString(). */
  format?: (value: number) => ReactNode;
};

/**
 * Labelled range slider with a mono value readout on the right. Use for any
 * numeric scrubber where the current value is worth seeing.
 */
export default function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
}: Props) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="slider-value">{format ? format(value) : value}</span>
    </label>
  );
}
