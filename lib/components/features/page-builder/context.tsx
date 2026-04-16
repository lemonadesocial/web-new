'use client';
import React from 'react';
import { PageNodes, NodeRecord } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function genId(): string {
  return Math.random().toString(36).slice(2, 11);
}

const CANVAS_COMPONENTS = new Set([
  'Container', 'Grid', 'Col', 'Tabs', 'Tab', 'Accordion', 'AccordionItem',
]);

const MAX_HISTORY = 50;

// ─────────────────────────────────────────────────────────────────────────────
// State (reducer)
// ─────────────────────────────────────────────────────────────────────────────

interface PageEditorState {
  nodes: PageNodes;
  selectedId: string | null;
  past: PageNodes[];
  future: PageNodes[];
}

type PageEditorAction =
  | { type: 'DESERIALIZE'; nodes: PageNodes }
  | { type: 'SELECT'; id: string | null }
  | { type: 'SET_PROP'; id: string; updater: (props: Record<string, any>) => void }
  | { type: 'DELETE'; nodeId: string }
  | { type: 'MOVE'; nodeId: string; targetParentId: string; targetIndex: number }
  | { type: 'ADD'; parentId: string; nodeId: string; node: NodeRecord; index: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' };

function deleteNodeRecursive(nodes: PageNodes, nodeId: string): PageNodes {
  const next = { ...nodes };
  const recurse = (id: string) => {
    const n = next[id];
    if (!n) return;
    n.nodes.forEach(recurse);
    delete next[id];
  };
  recurse(nodeId);
  return next;
}

function reducer(state: PageEditorState, action: PageEditorAction): PageEditorState {
  switch (action.type) {
    case 'DESERIALIZE': {
      return { nodes: action.nodes, selectedId: null, past: [], future: [] };
    }

    case 'SELECT': {
      return { ...state, selectedId: action.id };
    }

    case 'SET_PROP': {
      const node = state.nodes[action.id];
      if (!node) return state;
      const props = { ...node.props };
      action.updater(props);
      const nodes = { ...state.nodes, [action.id]: { ...node, props } };
      return {
        ...state,
        nodes,
        past: [...state.past.slice(-MAX_HISTORY + 1), state.nodes],
        future: [],
      };
    }

    case 'DELETE': {
      const node = state.nodes[action.nodeId];
      if (!node) return state;
      let nodes = deleteNodeRecursive(state.nodes, action.nodeId);
      if (node.parent && nodes[node.parent]) {
        nodes = {
          ...nodes,
          [node.parent]: {
            ...nodes[node.parent],
            nodes: nodes[node.parent].nodes.filter((id) => id !== action.nodeId),
          },
        };
      }
      return {
        ...state,
        nodes,
        selectedId: state.selectedId === action.nodeId ? null : state.selectedId,
        past: [...state.past.slice(-MAX_HISTORY + 1), state.nodes],
        future: [],
      };
    }

    case 'MOVE': {
      const { nodeId, targetParentId, targetIndex } = action;
      const node = state.nodes[nodeId];
      if (!node || !state.nodes[targetParentId]) return state;

      const nodes = { ...state.nodes };
      const sourceParentId = node.parent;

      // Remove from source parent
      if (sourceParentId && nodes[sourceParentId]) {
        nodes[sourceParentId] = {
          ...nodes[sourceParentId],
          nodes: nodes[sourceParentId].nodes.filter((id) => id !== nodeId),
        };
      }

      // Compute adjusted index for same-parent moves
      let insertIndex = targetIndex;
      if (sourceParentId === targetParentId) {
        const oldIndex = state.nodes[targetParentId].nodes.indexOf(nodeId);
        if (oldIndex !== -1 && oldIndex < targetIndex) insertIndex = targetIndex - 1;
      }

      const targetNodes = [...nodes[targetParentId].nodes];
      targetNodes.splice(Math.max(0, Math.min(insertIndex, targetNodes.length)), 0, nodeId);
      nodes[targetParentId] = { ...nodes[targetParentId], nodes: targetNodes };
      nodes[nodeId] = { ...nodes[nodeId], parent: targetParentId };

      return {
        ...state,
        nodes,
        past: [...state.past.slice(-MAX_HISTORY + 1), state.nodes],
        future: [],
      };
    }

    case 'ADD': {
      const { parentId, nodeId, node, index } = action;
      if (!state.nodes[parentId]) return state;

      const targetNodes = [...state.nodes[parentId].nodes];
      targetNodes.splice(Math.max(0, Math.min(index, targetNodes.length)), 0, nodeId);

      const nodes = {
        ...state.nodes,
        [nodeId]: node,
        [parentId]: { ...state.nodes[parentId], nodes: targetNodes },
      };
      return {
        ...state,
        nodes,
        past: [...state.past.slice(-MAX_HISTORY + 1), state.nodes],
        future: [],
      };
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return {
        ...state,
        nodes: prev,
        past: state.past.slice(0, -1),
        future: [state.nodes, ...state.future].slice(0, MAX_HISTORY),
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return {
        ...state,
        nodes: next,
        past: [...state.past, state.nodes].slice(-MAX_HISTORY),
        future: state.future.slice(1),
      };
    }

    case 'CLEAR_HISTORY': {
      return { ...state, past: [], future: [] };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context types
// ─────────────────────────────────────────────────────────────────────────────

export interface PageEditorContextValue {
  nodes: PageNodes;
  enabled: boolean;
  selectedId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  actions: {
    selectNode: (id: string | null) => void;
    deserialize: (json: string) => void;
    setProp: (id: string, updater: (props: Record<string, any>) => void) => void;
    deleteNode: (id: string) => void;
    moveNode: (nodeId: string, targetParentId: string, targetIndex: number) => void;
    addNode: (
      parentId: string,
      componentName: string,
      displayName: string,
      props?: Record<string, any>,
      index?: number,
    ) => string;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    history: {
      undo: () => void;
      redo: () => void;
      clear: () => void;
    };
  };
  query: {
    serialize: () => string;
    node: (id: string) => { get: () => NodeRecord & { id: string } };
    history: {
      canUndo: () => boolean;
      canRedo: () => boolean;
    };
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Contexts
// ─────────────────────────────────────────────────────────────────────────────

const PageEditorContext = React.createContext<PageEditorContextValue | null>(null);

/** Provides the current node's ID to all nested components (mirrors CraftJS's node context). */
export const NodeIdContext = React.createContext<string>('');

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

export function usePageEditor(): PageEditorContextValue {
  const ctx = React.useContext(PageEditorContext);
  if (!ctx) throw new Error('usePageEditor must be used inside PageEditorProvider');
  return ctx;
}

export function useNodeId(): string {
  return React.useContext(NodeIdContext);
}

/** Replaces CraftJS's `useNode` – reads the current node's data from NodeIdContext. */
export function usePageNode() {
  const id = useNodeId();
  const { nodes, selectedId, actions } = usePageEditor();
  const node = nodes[id];
  return {
    id,
    props: node?.props ?? {},
    nodeProps: node?.props ?? {},
    selected: selectedId === id,
    actions: {
      setProp: (updater: (props: Record<string, any>) => void) => actions.setProp(id, updater),
    },
  };
}

/** For settings panels: reads from the *selected* node (replaces old SettingsPanel's useSettings). */
export function useSettings() {
  const { selectedId, nodes, actions } = usePageEditor();
  const id = selectedId ?? '';
  const props = nodes[id]?.props ?? {};
  return {
    id,
    props,
    actions: {
      setProp: (updater: (props: Record<string, any>) => void) => {
        if (!id) return;
        actions.setProp(id, updater);
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function PageEditorProvider({
  children,
  enabled = false,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  const [state, dispatch] = React.useReducer(reducer, {
    nodes: {},
    selectedId: null,
    past: [],
    future: [],
  });

  const { nodes, selectedId, past, future } = state;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const selectNode = React.useCallback((id: string | null) => dispatch({ type: 'SELECT', id }), []);

  const deserialize = React.useCallback((json: string) => {
    try {
      const raw: PageNodes = typeof json === 'string' ? JSON.parse(json) : json;
      const normalized = Object.keys(raw).reduce<PageNodes>((acc, key) => {
        acc[key] = {
          ...raw[key],
          props: raw[key].props ?? {},
          nodes: raw[key].nodes ?? [],
          linkedNodes: raw[key].linkedNodes ?? {},
          custom: raw[key].custom ?? {},
        };
        return acc;
      }, {});
      dispatch({ type: 'DESERIALIZE', nodes: normalized });
    } catch (e) {
      console.error('PageEditor: failed to deserialize', e);
    }
  }, []);

  const setProp = React.useCallback(
    (id: string, updater: (props: Record<string, any>) => void) =>
      dispatch({ type: 'SET_PROP', id, updater }),
    [],
  );

  const deleteNode = React.useCallback(
    (nodeId: string) => dispatch({ type: 'DELETE', nodeId }),
    [],
  );

  const moveNode = React.useCallback(
    (nodeId: string, targetParentId: string, targetIndex: number) =>
      dispatch({ type: 'MOVE', nodeId, targetParentId, targetIndex }),
    [],
  );

  const addNode = React.useCallback(
    (
      parentId: string,
      componentName: string,
      displayName: string,
      props: Record<string, any> = {},
      index?: number,
    ): string => {
      const nodeId = genId();
      const node: NodeRecord = {
        type: { resolvedName: componentName },
        isCanvas: CANVAS_COMPONENTS.has(componentName),
        props,
        nodes: [],
        linkedNodes: {},
        parent: parentId,
        displayName,
        custom: {},
      };
      dispatch({
        type: 'ADD',
        parentId,
        nodeId,
        node,
        index: index ?? Number.MAX_SAFE_INTEGER,
      });
      return nodeId;
    },
    [],
  );

  const undo = React.useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = React.useCallback(() => dispatch({ type: 'REDO' }), []);
  const clearHistory = React.useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);

  // Stable ref so serialize() always returns fresh data without triggering re-renders
  const nodesRef = React.useRef(nodes);
  nodesRef.current = nodes;

  const value = React.useMemo<PageEditorContextValue>(
    () => ({
      nodes,
      enabled,
      selectedId,
      canUndo,
      canRedo,
      actions: {
        selectNode,
        deserialize,
        setProp,
        deleteNode,
        moveNode,
        addNode,
        undo,
        redo,
        clearHistory,
        history: { undo, redo, clear: clearHistory },
      },
      query: {
        serialize: () => JSON.stringify(nodesRef.current),
        node: (id: string) => ({ get: () => ({ ...nodesRef.current[id], id }) }),
        history: { canUndo: () => canUndo, canRedo: () => canRedo },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, enabled, selectedId, canUndo, canRedo],
  );

  return <PageEditorContext.Provider value={value}>{children}</PageEditorContext.Provider>;
}
