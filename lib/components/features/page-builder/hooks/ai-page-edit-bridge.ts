/**
 * Module-level bridge for AI page edit triggers.
 * Lets code outside the Craft.js Editor context (e.g. InputChat)
 * invoke editor actions that require useEditor().
 */

export interface AIPageEditTriggers {
  applyStructureData: (data: string) => void;
  getStructureData: () => string | null;
  resetToDefault: () => void;
}

let _triggers: AIPageEditTriggers | null = null;

export function setAIPageEditTriggers(triggers: AIPageEditTriggers | null) {
  _triggers = triggers;
}

export function getAIPageEditTriggers(): AIPageEditTriggers | null {
  return _triggers;
}
