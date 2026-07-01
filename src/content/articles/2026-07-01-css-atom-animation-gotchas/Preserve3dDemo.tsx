import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Slider, Hint } from '../../../components/demo';

export default function Preserve3dDemo() {
  const [preserve, setPreserve] = useState<'off' | 'on'>('off');
  const [push, setPush] = useState(80);

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={preserve}
          onChange={setPreserve}
          options={[
            { value: 'off', label: 'middle wrapper: preserve-3d off' },
            { value: 'on', label: 'middle wrapper: preserve-3d on' },
          ]}
        />
      </Toolbar>
      <div style={{ marginBottom: '1rem' }}>
        <Slider
          label="inner translateZ push"
          min={0}
          max={150}
          value={push}
          onChange={setPush}
          format={(v) => `${v}px`}
        />
      </div>
      <div
        style={{
          perspective: '500px',
          width: '100%',
          height: 160,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {/* outer: preserve-3d, holds the whole chain in 3D and tilts for visibility */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateY(25deg)',
          }}
        >
          {/* middle: the toggle under test */}
          <div
            style={{
              transformStyle: preserve === 'on' ? 'preserve-3d' : 'flat',
            }}
          >
            {/* inner: carries the translateZ push, never changes */}
            <div
              style={{
                width: 70,
                height: 70,
                background: 'var(--ink)',
                transform: `translateZ(${push}px)`,
                transition: 'transform 0.2s',
              }}
            />
          </div>
        </div>
      </div>
      <Hint>
        The inner box’s <code>translateZ</code> never changes between the two
        toggle states — only the middle wrapper’s <code>transform-style</code>{' '}
        does. With <code>preserve-3d</code> off, the browser flattens the
        inner box into the wrapper’s flat plane before rendering, so the push
        is discarded and the slider does nothing visible. Switch it on, and
        the exact same push suddenly renders — the box grows and shifts as it
        moves toward the camera. Nothing about the inner element changed;
        only whether an ancestor was willing to render it in 3D.
      </Hint>
    </Demo>
  );
}
