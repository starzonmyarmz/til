import { useState } from 'react';
import { Demo, Toolbar, ToggleGroup, Badge, Hint } from '../../../components/demo';

export default function KeyframeCollisionDemo() {
  const [collide, setCollide] = useState<'unique' | 'collide'>('unique');

  const css =
    collide === 'collide'
      ? `
        @keyframes til-shared-kf { to { transform: rotate(360deg); } }
        @keyframes til-shared-kf { to { opacity: 0.18; } }
        .til-turntable-box { animation: til-shared-kf 1.6s linear infinite; }
        .til-electron-box { animation: til-shared-kf 1.6s linear infinite; }
      `
      : `
        @keyframes til-spin-kf { to { transform: rotate(360deg); } }
        @keyframes til-fade-kf { to { opacity: 0.18; } }
        .til-turntable-box { animation: til-spin-kf 1.6s linear infinite; }
        .til-electron-box { animation: til-fade-kf 1.6s linear infinite; }
      `;

  return (
    <Demo>
      <style>{css}</style>
      <Toolbar>
        <ToggleGroup
          value={collide}
          onChange={setCollide}
          options={[
            { value: 'unique', label: 'unique keyframe names' },
            { value: 'collide', label: 'same name, declared twice' },
          ]}
        />
      </Toolbar>
      <div
        style={{
          display: 'flex',
          gap: '3rem',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 0',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            className="til-turntable-box"
            style={{
              width: 56,
              height: 56,
              background: 'var(--ink)',
              margin: '0 auto 0.75rem',
            }}
          />
          <Badge tone={collide === 'collide' ? 'bad' : 'good'}>
            turntable {collide === 'collide' ? 'stopped rotating' : 'rotating'}
          </Badge>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            className="til-electron-box"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--ink)',
              margin: '0 auto 0.75rem',
            }}
          />
          <Badge tone="good">electron fading (as intended)</Badge>
        </div>
      </div>
      <Hint>
        Both boxes reference an animation called <code>til-shared-kf</code> when
        “same name” is selected. Two <code>@keyframes til-shared-kf</code> blocks
        exist in this stylesheet — the second, a fade, silently wins for every
        element using that name, including the square that was supposed to
        rotate. The circle looks unaffected only because fading was already its
        job.
      </Hint>
    </Demo>
  );
}
