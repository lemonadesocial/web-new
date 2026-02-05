import { useRef, useLayoutEffect } from "react";

/**
 * Returns a ref that always contains the latest value.
 * Useful for accessing current values in callbacks without causing re-renders.
 *
 * @example
 * const countRef = useLatest(count);
 * const handleClick = useCallback(() => {
 *   console.log(countRef.current); // Always the latest count
 * }, []); // No dependency needed!
 */
export function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = useRef<T>(value);

  // Use useLayoutEffect to update synchronously before any effects run
  useLayoutEffect(() => {
    ref.current = value;
  });

  return ref;
}
