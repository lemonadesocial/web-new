'use client';

import React from 'react';

/**
 * Module-level store for Craft.js editor connectors.
 *
 * The CraftStateWatcher (inside the Editor context) sets this ref,
 * and components rendered outside the context (e.g., in a drawer)
 * can read from it.
 */
interface EditorConnectors {
  create: (ref: HTMLElement, element: React.ReactElement) => void;
}

let _editorConnectors: EditorConnectors | null = null;

/** Called from within the Craft.js Editor to register connectors. */
export function setEditorConnectors(connectors: EditorConnectors | null) {
  _editorConnectors = connectors;
}

/** Get the stored editor connectors (returns null if editor is not mounted). */
export function getEditorConnectors(): EditorConnectors | null {
  return _editorConnectors;
}
