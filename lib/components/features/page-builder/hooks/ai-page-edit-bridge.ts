/**
 * Module-level bridge for AI page edit triggers.
 * Lets code outside the Craft.js Editor context (e.g. InputChat)
 * invoke editor actions that require useEditor().
 */

import type { PageSection } from '$utils/page-sections-mapper';

export interface AIPageEditTriggers {
  /** Apply a full serialized Craft.js node map string (legacy / fallback). */
  applyStructureData: (data: string) => void;
  /** Replace the entire page from a PageSection[] returned by page_designer tool. */
  applySections: (sections: PageSection[]) => void;
  /** Surgically update or inject a single section from section_designer tool. */
  applySectionUpdate: (section: PageSection) => void;
  /** Apply a PageTheme returned by page_designer tool to the theme editor state. */
  applyTheme: (theme: Record<string, unknown>) => void;
  /** Apply persisted custom page code returned by page_designer. */
  applyCustomCode: (customCode: Record<string, unknown> | undefined) => void;
  /** Return current page as PageSection[] for persistence. */
  getSections: () => PageSection[];
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
