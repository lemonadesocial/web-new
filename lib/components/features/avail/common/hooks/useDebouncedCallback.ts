import { useEffect, useMemo, useRef } from "react";
import { useStableCallback } from "./useStableCallback";

type AnyFn = (...args: any[]) => any;

export interface Debounced<T extends AnyFn> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * Returns a debounced function that delays invoking `fn` until after `delay`
 * milliseconds have elapsed since the last call.
 */
export function useDebouncedCallback<T extends AnyFn>(
  fn: T,
  delay: number
): Debounced<T> {
  const latest = useStableCallback(fn);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const flush = () => {
    if (timerRef.current && lastArgsRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
       
      latest(...lastArgsRef.current);
      lastArgsRef.current = null;
    }
  };

  // cancel when delay changes/unmounts
  useEffect(() => cancel, [delay]);

  return useMemo(() => {
    const debounced = ((...args: Parameters<T>) => {
      lastArgsRef.current = args;
      cancel();
      timerRef.current = setTimeout(() => {
         
        latest(...lastArgsRef.current!);
        lastArgsRef.current = null;
        timerRef.current = null;
      }, delay);
    }) as Debounced<T>;
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, latest]);
}
