import { useEffect, useRef, useState } from "react";

interface UseStopwatchOptions {
  running?: boolean;
  intervalMs?: number;
}

/**
 * Simple stopwatch that increments elapsed seconds while running.
 * Designed to replace scattered timer effects.
 */
export function useStopwatch(options: UseStopwatchOptions = {}) {
  const { running = false, intervalMs = 100 } = options;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    setElapsedSeconds(0);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      // 1s == 1000ms; we add fractional seconds per tick
      setElapsedSeconds((prev) => prev + intervalMs / 1000);
    }, intervalMs);
  };

  useEffect(() => {
    if (running) {
      start();
    } else {
      stop();
    }
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, intervalMs]);

  return {
    seconds: elapsedSeconds,
    start,
    stop,
    reset,
    running: Boolean(timerRef.current),
  };
}
