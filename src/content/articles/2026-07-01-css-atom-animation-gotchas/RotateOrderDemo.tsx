import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Hint } from '../../../components/demo';

const RINGS = [0, 1, 2];

export default function RotateOrderDemo() {
  const [order, setOrder] = useState<'buggy' | 'fixed'>('buggy');

  return (
    <Demo>
      <Toolbar>
        <ToggleGroup
          value={order}
          onChange={setOrder}
          options={[
            { value: 'buggy', label: 'rotate() then scaleY()' },
            { value: 'fixed', label: 'scaleY() then rotate()' },
          ]}
        />
      </Toolbar>
      <div
        style={{
          position: 'relative',
          width: 200,
          height: 200,
          margin: '1rem auto',
        }}
      >
        {RINGS.map((i) => {
          const angle = (180 / RINGS.length) * i;
          const transform =
            order === 'buggy'
              ? `translate(-50%, -50%) scaleY(0.4) rotate(${angle}deg)`
              : `translate(-50%, -50%) rotate(${angle}deg) scaleY(0.4)`;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 160,
                height: 160,
                borderRadius: '50%',
                border: '2px solid var(--ink)',
                opacity: 0.75,
                transform,
                transition: 'transform 0.3s',
              }}
            />
          );
        })}
      </div>
      <Hint>
        Each ring starts as a perfect circle, so applying <code>rotate()</code>{' '}
        to it first has nothing to act on — a circle looks identical at any
        rotation. <code>scaleY(0.4)</code> then flattens all three into the
        same horizontal ellipse. Swap the order: flattening into an ellipse
        first breaks the symmetry, so rotating each already-flattened ellipse
        by a different angle actually produces three distinct rings. This is
        the same rule <code>rotateX()</code> and <code>rotateZ()</code> follow
        in 3D — <code>transform</code> functions apply right to left, and a
        rotation before a symmetric shape is a no-op.
      </Hint>
    </Demo>
  );
}
