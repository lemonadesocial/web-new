/**
 * Module-level bridge for AI page edit triggers.
 *
 * Same pattern as `utils/use-safe-editor.ts`. Lets code outside the
 * Craft.js Editor context (e.g. InputChat) invoke AI page edit mutations
 * that require `useEditor()`.
 */

export interface AIPageEditTriggers {
  requestCreate: (input: Record<string, unknown>) => Promise<void>;
  requestUpdateSection: (configId: string, sectionId: string, input: Record<string, unknown>) => Promise<void>;
  requestGenerate: (input: Record<string, unknown>) => Promise<void>;
}

let _triggers: AIPageEditTriggers | null = null;

export function setAIPageEditTriggers(triggers: AIPageEditTriggers | null) {
  _triggers = triggers;
}

export function getAIPageEditTriggers(): AIPageEditTriggers | null {
  return _triggers;
}
