import { useRef, useState } from "react";
import { Demo, Hint } from "../../../components/demo";

const CARD_COUNT = 8;
const FADE_DISTANCE = 48;

export default function ScrollFadeDemo() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [fadeLeft, setFadeLeft] = useState(0);
  const [fadeRight, setFadeRight] = useState(FADE_DISTANCE);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setFadeLeft(Math.min(el.scrollLeft, FADE_DISTANCE));
    setFadeRight(Math.min(maxScroll - el.scrollLeft, FADE_DISTANCE));
  };

  const mask = `linear-gradient(to right, transparent, black ${fadeLeft}px, black calc(100% - ${fadeRight}px), transparent)`;

  return (
    <Demo>
      <Hint>
        Scroll the row. Edges fade toward whichever side still has more to
        scroll.
      </Hint>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        style={{
          display: "flex",
          gap: "0.75rem",
          overflowX: "auto",
          padding: "0.5rem 0",
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 7rem",
              height: "5rem",
              border: "1px solid var(--rule)",
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--mono)",
              color: "var(--ink-soft)",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </Demo>
  );
}
