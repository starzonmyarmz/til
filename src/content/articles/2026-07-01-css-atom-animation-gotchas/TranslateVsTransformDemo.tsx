import { useState } from 'react';
import { Demo, Slider, Hint } from '../../../components/demo';

const SPIN_CSS = `
  @keyframes til-spin-only { to { transform: rotate(360deg); } }
  .til-combined-box { animation: til-spin-only 2s linear infinite; }
  .til-split-box { animation: til-spin-only 2s linear infinite; }
`;

export default function TranslateVsTransformDemo() {
  const [x, setX] = useState(0);

  return (
    <Demo>
      <style>{SPIN_CSS}</style>
      <div style={{ marginBottom: '1rem' }}>
        <Slider
          label="position"
          min={-60}
          max={60}
          value={x}
          onChange={setX}
          format={(v) => `${v}px`}
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: '3rem',
          justifyContent: 'center',
          padding: '1.5rem 0',
        }}
      >
        <div style={{ textAlign: 'center', width: 160 }}>
          <div style={{ position: 'relative', height: 60 }}>
            <div
              className="til-combined-box"
              style={{
                position: 'absolute',
                left: '50%',
                width: 50,
                height: 50,
                marginLeft: -25,
                background: 'var(--ink)',
                // single `transform` property: the running animation's
                // keyframes replace this outright while it's active.
                transform: `translateX(${x}px)`,
              }}
            />
          </div>
          <p style={{ fontSize: '0.85em', marginTop: '0.5rem' }}>
            position baked into <code>transform</code> — ignored while spinning
          </p>
        </div>
        <div style={{ textAlign: 'center', width: 160 }}>
          <div style={{ position: 'relative', height: 60 }}>
            <div
              className="til-split-box"
              style={{
                position: 'absolute',
                left: '50%',
                width: 50,
                height: 50,
                marginLeft: -25,
                background: 'var(--ink)',
                // separate `translate` property: untouched by the
                // `transform`-only spin animation.
                translate: `${x}px 0`,
              }}
            />
          </div>
          <p style={{ fontSize: '0.85em', marginTop: '0.5rem' }}>
            position on <code>translate</code> — keeps moving while spinning
          </p>
        </div>
      </div>
      <Hint>
        Both boxes run the identical spin animation, which only ever sets{' '}
        <code>transform: rotate(...)</code>. The left box also tries to
        position itself through <code>transform</code>, so while the
        animation is active its keyframe value wins outright and the
        translation is dropped — dragging the slider does nothing visible.
        The right box positions itself through the separate{' '}
        <code>translate</code> property, which the animation never touches,
        so it slides freely while continuing to spin.
      </Hint>
    </Demo>
  );
}
