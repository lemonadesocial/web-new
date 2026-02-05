import { useMemo, useRef, useState } from "react";
import type { GenericStep } from "./types";
import { getStepKey } from "./types";
import {
  computeAllCompleted,
  mergeStepComplete,
  mergeStepsList,
  seedSteps,
} from "./steps";

interface UseTransactionStepsOptions<T> {
  expected?: T[];
}

/**
 * Manages transaction steps with utilities to seed from expected steps,
 * replace the list on "steps list" events, and mark individual steps complete.
 */
export function useTransactionSteps<
  T extends { typeID?: string; type?: string }
>(options: UseTransactionStepsOptions<T> = {}) {
  const { expected } = options;
  const [steps, setSteps] = useState<Array<GenericStep<T>>>(() =>
    expected ? seedSteps(expected) : []
  );
  const lastSignatureRef = useRef<string>("");

  const onStepsList = (list: T[]) => {
    const signature = list.map((step) => getStepKey(step)).join("|");
    if (lastSignatureRef.current === signature) {
      setSteps((prev) => mergeStepsList(prev, list));
      return;
    }
    lastSignatureRef.current = signature;
    setSteps((prev) => mergeStepsList(prev, list));
  };

  const onStepComplete = (step: T) => {
    setSteps((prev) => mergeStepComplete(prev, step));
  };

  const seed = (expectedSteps: T[]) => {
    setSteps(seedSteps(expectedSteps));
  };

  const reset = () => {
    setSteps(expected ? seedSteps(expected) : []);
    lastSignatureRef.current = "";
  };

  const allCompleted = useMemo(() => computeAllCompleted(steps), [steps]);

  return {
    steps,
    allCompleted,
    onStepsList,
    onStepComplete,
    seed,
    reset,
  };
}
