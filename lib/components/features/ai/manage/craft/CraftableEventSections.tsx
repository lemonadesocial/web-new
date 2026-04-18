'use client';
import React from 'react';
import { usePageEditor } from '$lib/components/features/page-builder/context';
import { PageRenderer } from '$lib/components/features/page-builder/renderer';
import { GetPageConfigQuery } from '$lib/graphql/generated/backend/graphql';
import { resolver } from './resolver';

export function CraftableEventSections({ data }: { data?: Record<string, any> }) {
  const { nodes, actions } = usePageEditor();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (data !== undefined) {
      actions.deserialize(JSON.stringify(data));
    }
    setReady(true);
  }, []);

  if (Object.keys(nodes).length === 0 || !ready) return null;
  return <PageRenderer resolver={resolver} />;
}
