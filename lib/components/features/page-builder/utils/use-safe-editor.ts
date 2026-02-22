'use client';

import React from 'react';

/**
 * Module-level bridge for Craft.js editor capabilities.
 *
 * The CraftStateWatcher (inside the Editor context) registers these refs,
 * and components rendered outside the context (e.g., in drawers) can
 * read from them without calling useEditor().
 */

// ── Connectors bridge (for drag-to-create in SectionCatalog) ──

interface EditorConnectors {
  create: (ref: HTMLElement, element: React.ReactElement) => void;
}

let _editorConnectors: EditorConnectors | null = null;

export function setEditorConnectors(connectors: EditorConnectors | null) {
  _editorConnectors = connectors;
}

export function getEditorConnectors(): EditorConnectors | null {
  return _editorConnectors;
}

// ── Actions bridge (for prop editing in PropsPanel) ──

interface EditorActions {
  setProp: (nodeId: string, cb: (props: Record<string, unknown>) => void) => void;
}

let _editorActions: EditorActions | null = null;

export function setEditorActions(actions: EditorActions | null) {
  _editorActions = actions;
}

export function getEditorActions(): EditorActions | null {
  return _editorActions;
}

// ── Node info reader (for reading current props of a selected node) ──

type NodeInfoReader = (nodeId: string) => {
  displayName: string;
  props: Record<string, unknown>;
} | null;

let _nodeInfoReader: NodeInfoReader | null = null;

export function setNodeInfoReader(reader: NodeInfoReader | null) {
  _nodeInfoReader = reader;
}

export function getNodeInfo(nodeId: string) {
  return _nodeInfoReader?.(nodeId) ?? null;
}
