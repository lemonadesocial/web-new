export type TransactionStatus =
  | "idle"
  | "preview"
  | "awaiting-approval"
  | "executing"
  | "success"
  | "error";

export type GenericStep<TStep> = {
  id: number;
  completed: boolean;
  step: TStep;
};

/**
 * Normalizes a step to a stable key. Prefers typeID, then type, otherwise JSON.
 */
export function getStepKey(step: any): string {
  if (!step) return "";
  if (typeof step.typeID === "string" && step.typeID.length > 0) {
    return step.typeID;
  }
  if (typeof step.type === "string" && step.type.length > 0) {
    return step.type;
  }
  try {
    return JSON.stringify(step);
  } catch {
    return String(step);
  }
}
