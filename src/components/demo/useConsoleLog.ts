import { useCallback, useState } from 'react';
import type { ConsoleLine, Tone } from './Console';

/**
 * Rolling log for <Console>, capped at `max` total entries (default 8).
 * Replaces the hand-rolled `setLines((prev) => [...prev.slice(-n), entry])`
 * pattern that shows up in most log-driven demos.
 */
export function useConsoleLog(max = 8) {
  const [lines, setLines] = useState<ConsoleLine[]>([]);

  const push = useCallback(
    (line: ConsoleLine['line'], tone: Tone = 'info') => {
      setLines((prev) => [...prev.slice(-(max - 1)), { line, tone }]);
    },
    [max],
  );

  const reset = useCallback(() => setLines([]), []);

  return { lines, push, reset };
}

export default useConsoleLog;
