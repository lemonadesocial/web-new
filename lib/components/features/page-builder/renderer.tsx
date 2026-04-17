'use client';
import React from 'react';
import { usePageEditor, NodeIdContext } from './context';

/**
 * Renders the page node tree starting from `rootId`.
 * Requires a `resolver` prop that maps `resolvedName` → React component.
 */
export function PageRenderer({
  rootId = 'ROOT',
  resolver,
}: {
  rootId?: string;
  resolver: Record<string, React.ComponentType<any>>;
}) {
  const { nodes } = usePageEditor();
  if (!nodes[rootId]) return null;
  return <RenderNode nodeId={rootId} resolver={resolver} />;
}

function RenderNode({ nodeId, resolver }: { nodeId: string; resolver: Record<string, React.ComponentType<any>> }) {
  const { nodes } = usePageEditor();
  const node = nodes[nodeId];
  if (!node) return null;

  const Component = resolver[node.type.resolvedName];
  if (!Component) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`PageRenderer: unknown component "${node.type.resolvedName}"`);
    }
    return null;
  }

  const children =
    node.nodes.length > 0
      ? node.nodes.map((childId) => <RenderNode key={childId} nodeId={childId} resolver={resolver} />)
      : null;

  return (
    <NodeIdContext.Provider value={nodeId}>
      <Component {...node.props}>{children}</Component>
    </NodeIdContext.Provider>
  );
}
