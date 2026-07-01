import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Slider, Hint } from '../../../components/demo';

const HARDCODED_DELAYS = [0, -0.6]; // tuned for exactly 2 items

export default function SiblingIndexDemo() {
  const [mode, setMode] = useState<'hardcoded' | 'formula'>('hardcoded');
  const [count, setCount] = useState(2);

  const items = Array.from({ length: count }, (_, i) => i);
  const radius = 70;

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={mode}
          onChange={setMode}
          options={[
            { value: 'hardcoded', label: 'hardcoded spacing' },
            { value: 'formula', label: 'sibling-index() formula' },
          ]}
        />
      </Toolbar>
      <div style={{ marginBottom: '1rem' }}>
        <Slider
          label="electrons on the ring"
          min={2}
          max={8}
          value={count}
          onChange={setCount}
        />
      </div>
      <div
        style={{
          position: 'relative',
          width: radius * 2 + 40,
          height: radius * 2 + 40,
          margin: '0 auto',
        }}
      >
        {items.map((i) => {
          // formula: evenly divide 360deg by however many siblings exist
          const formulaAngle = (360 / count) * i;
          // hardcoded: only the first two angles were ever authored
          const hardcodedAngle =
            i < HARDCODED_DELAYS.length ? i * 180 : 0;
          const angle = mode === 'formula' ? formulaAngle : hardcodedAngle;
          const rad = (angle * Math.PI) / 180;
          const x = radius + radius * Math.cos(rad);
          const y = radius + radius * Math.sin(rad);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'var(--ink)',
                transform: 'translate(-50%, -50%)',
                transition: 'left 0.25s, top 0.25s',
              }}
            />
          );
        })}
      </div>
      <Hint>
        This recreates the effect with plain arithmetic, since{' '}
        <code>sibling-index()</code> and <code>sibling-count()</code> only run
        in Chrome 138+ and Safari 26.2+ today. In hardcoded mode, only the
        first two positions were ever authored — every electron past the
        second one collapses to angle zero and stacks on the first. In
        formula mode, every electron divides the full circle by however many
        siblings currently exist, so the ring stays evenly spaced as the
        slider changes.
      </Hint>
    </Demo>
  );
}
