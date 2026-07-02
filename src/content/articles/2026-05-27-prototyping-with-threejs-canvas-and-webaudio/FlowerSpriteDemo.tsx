import { useEffect, useMemo, useRef, useState } from 'react';
import { Demo, Slider, Output, OutputRow, Hint, CanvasStage } from '../../../components/demo';

export default function FlowerSpriteDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [petals, setPetals] = useState(8);
  const [hue, setHue] = useState(330);
  const [centerSize, setCenterSize] = useState(10);

  const petalColor = useMemo(() => `hsl(${hue}, 75%, 65%)`, [hue]);
  const centerColor = useMemo(() => `hsl(${(hue + 200) % 360}, 80%, 55%)`, [hue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const x = canvas.getContext('2d');
    if (!x) return;
    x.clearRect(0, 0, 128, 128);
    // stem
    x.strokeStyle = '#2a7a2a';
    x.lineWidth = 6;
    x.beginPath();
    x.moveTo(64, 128);
    x.lineTo(64, 70);
    x.stroke();
    // leaf
    x.fillStyle = '#3a9a3a';
    x.beginPath();
    x.ellipse(50, 95, 12, 6, -0.6, 0, Math.PI * 2);
    x.fill();
    // petals
    x.fillStyle = petalColor;
    for (let i = 0; i < petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      const px = 64 + Math.cos(a) * 22;
      const py = 50 + Math.sin(a) * 22;
      x.beginPath();
      x.ellipse(px, py, 14, 9, a, 0, Math.PI * 2);
      x.fill();
    }
    // centre
    x.fillStyle = centerColor;
    x.beginPath();
    x.arc(64, 50, centerSize, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = '#b88800';
    x.beginPath();
    x.arc(64, 50, Math.max(2, centerSize * 0.6), 0, Math.PI * 2);
    x.fill();
  }, [petals, hue, centerSize, petalColor, centerColor]);

  return (
    <Demo>
      <Slider label="petals" min={3} max={16} value={petals} onChange={setPetals} />
      <Slider label="hue" min={0} max={359} value={hue} onChange={setHue} />
      <Slider label="centre" min={4} max={18} value={centerSize} onChange={setCenterSize} />

      <CanvasStage canvasRef={canvasRef} width={128} height={128} background="transparent" />

      <Output>
        <OutputRow label="petal fill:">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '0.85em',
                height: '0.85em',
                borderRadius: 3,
                background: petalColor,
                border: '1px solid var(--rule)',
              }}
            />
            {petalColor}
          </span>
        </OutputRow>
        <OutputRow label="centre fill:">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '0.85em',
                height: '0.85em',
                borderRadius: 3,
                background: centerColor,
                border: '1px solid var(--rule)',
              }}
            />
            {centerColor}
          </span>
        </OutputRow>
        <OutputRow label="three.js step:">new THREE.CanvasTexture(canvas)</OutputRow>
      </Output>

      <Hint>
        The same canvas would feed `new THREE.CanvasTexture(canvas)` and wrap into a
        `SpriteMaterial`. Calling `texture.needsUpdate = true` after each redraw is the only
        extra step.
      </Hint>
    </Demo>
  );
}
