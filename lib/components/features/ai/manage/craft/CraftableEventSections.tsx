'use client';
import { usePageEditor } from '$lib/components/features/page-builder/context';
import { PageRenderer } from '$lib/components/features/page-builder/renderer';
import { GetPageConfigQuery } from '$lib/graphql/generated/backend/graphql';
import { resolver } from './resolver';

export function CraftableEventSections({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pageConfig: _pageConfig,
}: {
  pageConfig?: GetPageConfigQuery['getPageConfig'];
}) {
  const { nodes } = usePageEditor();
  if (Object.keys(nodes).length === 0) return null;
  return <PageRenderer resolver={resolver} />;
}
