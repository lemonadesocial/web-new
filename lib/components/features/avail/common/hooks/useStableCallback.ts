import { useCallback, useRef } from "react";

/**
 * Returns a stable function identity that always calls the latest implementation.
 * Useful when passing callbacks to memoized children without re-creating handlers.
 */
export function useStableCallback<Args extends readonly unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const fnRef = useRef<(...args: Args) => Return>(fn);
  fnRef.current = fn;

   
  const stable = useCallback(
    ((...args: Args) => {
      return fnRef.current(...args);
    }) as (...args: Args) => Return,
    []
  );

  return stable;
}
