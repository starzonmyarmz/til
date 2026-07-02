import type { MouseEvent, RefObject } from 'react';

type Props = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  onClick?: (e: MouseEvent<HTMLCanvasElement>) => void;
  background?: string;
  cursor?: string;
};

/**
 * Centered, bordered, pixel-art canvas. Wraps a raw <canvas> so sprite and
 * game-loop demos don't each re-style the centering + pixelation by hand.
 */
export default function CanvasStage({
  canvasRef,
  width,
  height,
  onClick,
  background = 'transparent',
  cursor = 'default',
}: Props) {
  return (
    <div className="canvas-stage">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={onClick}
        style={{
          width: '100%',
          maxWidth: width,
          height: 'auto',
          imageRendering: 'pixelated',
          border: '1px solid var(--rule)',
          borderRadius: 4,
          background,
          cursor,
        }}
      />
    </div>
  );
}
