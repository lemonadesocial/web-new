import { useRef } from "react";
import { useInterval } from "./useInterval";
import { useStableCallback } from "./useStableCallback";

/**
 * Declarative polling with in-flight protection (no overlap).
 * When enabled becomes true, an immediate run is executed,
 * followed by interval-based runs.
 */
export function usePolling(
  enabled: boolean,
  fn: () => Promise<void> | void,
  intervalMs: number
) {
  const inFlightRef = useRef(false);
  const wrapped = useStableCallback(async () => {
    if (inFlightRef.current) return;
    try {
      inFlightRef.current = true;
      await fn();
    } catch (error) {
      console.error(error);
    } finally {
      inFlightRef.current = false;
    }
  });

  useInterval(wrapped, enabled ? intervalMs : null, {
    enabled,
    immediate: enabled,
  });
}
