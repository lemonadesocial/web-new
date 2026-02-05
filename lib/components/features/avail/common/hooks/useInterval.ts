import { useEffect, useRef } from "react";
import { useStableCallback } from "./useStableCallback";

interface UseIntervalOptions {
  enabled?: boolean;
  immediate?: boolean;
}

/**
 * Declarative setInterval with pause/resume and latest-callback semantics.
 * Pass delay=null to pause.
 */
export function useInterval(
  callback: () => void,
  delay: number | null,
  options: UseIntervalOptions = {}
) {
  const { enabled = true, immediate = false } = options;
  const savedCallback = useStableCallback(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || delay == null) return;
    if (immediate) {
      savedCallback();
    }
    intervalRef.current = setInterval(savedCallback, delay);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [delay, enabled, immediate, savedCallback]);
}
