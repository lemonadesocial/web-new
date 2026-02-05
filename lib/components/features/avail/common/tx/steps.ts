import type { SwapStepType } from "@avail-project/nexus-core";
import type { GenericStep } from "./types";
import { getStepKey } from "./types";

/**
 * Predefined expected steps for swaps to seed UI before events arrive.
 * Kept here to avoid duplication across exact-in and exact-out hooks.
 */
export const SWAP_EXPECTED_STEPS: SwapStepType[] = [
  { type: "SWAP_START", typeID: "SWAP_START" } as SwapStepType,
  { type: "DETERMINING_SWAP", typeID: "DETERMINING_SWAP" } as SwapStepType,
  {
    type: "CREATE_PERMIT_FOR_SOURCE_SWAP",
    typeID:
      "CREATE_PERMIT_FOR_SOURCE_SWAP" as unknown as SwapStepType["typeID"],
  } as SwapStepType,
  {
    type: "SOURCE_SWAP_BATCH_TX",
    typeID: "SOURCE_SWAP_BATCH_TX",
  } as SwapStepType,
  {
    type: "SOURCE_SWAP_HASH",
    typeID: "SOURCE_SWAP_HASH" as unknown as SwapStepType["typeID"],
  } as SwapStepType,
  { type: "RFF_ID", typeID: "RFF_ID" } as SwapStepType,
  {
    type: "DESTINATION_SWAP_BATCH_TX",
    typeID: "DESTINATION_SWAP_BATCH_TX",
  } as SwapStepType,
  {
    type: "DESTINATION_SWAP_HASH",
    typeID: "DESTINATION_SWAP_HASH" as unknown as SwapStepType["typeID"],
  } as SwapStepType,
  { type: "SWAP_COMPLETE", typeID: "SWAP_COMPLETE" } as SwapStepType,
];

export function seedSteps<T>(expected: T[]): Array<GenericStep<T>> {
  return expected.map((st, index) => ({
    id: index,
    completed: false,
    step: st,
  }));
}

export function computeAllCompleted<T>(steps: Array<GenericStep<T>>): boolean {
  return steps.length > 0 && steps.every((s) => s.completed);
}

/**
 * Replace the current list of steps with a new list, preserving completion
 * for any steps that were already marked completed (matched by key).
 */
export function mergeStepsList<T>(
  prev: Array<GenericStep<T>>,
  list: T[]
): Array<GenericStep<T>> {
  const completedKeys = new Set<string>();
  for (const prevStep of prev) {
    if (prevStep.completed) {
      completedKeys.add(getStepKey(prevStep.step));
    }
  }
  const next: Array<GenericStep<T>> = [];
  for (let index = 0; index < list.length; index++) {
    const step = list[index];
    const key = getStepKey(step);
    next.push({
      id: index,
      completed: completedKeys.has(key),
      step,
    });
  }
  return next;
}

/**
 * Mark a step complete in-place; if the step doesn't yet exist, append it.
 */
export function mergeStepComplete<T>(
  prev: Array<GenericStep<T>>,
  step: T
): Array<GenericStep<T>> {
  const key = getStepKey(step);
  const updated: Array<GenericStep<T>> = [];
  let found = false;
  for (const s of prev) {
    if (getStepKey(s.step) === key) {
      updated.push({ ...s, completed: true, step: { ...s.step, ...step } });
      found = true;
    } else {
      updated.push(s);
    }
  }
  if (!found) {
    updated.push({
      id: updated.length,
      completed: true,
      step,
    });
  }
  return updated;
}
