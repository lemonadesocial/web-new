'use client';
import React from 'react';
import { useEditor, Frame } from '@craftjs/core';
import { GetPageConfigQuery, PageConfigFragmentFragmentDoc } from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { sectionsToNodes, type PageSection } from '$utils/page-sections-mapper';

export function CraftableEventSections({
  pageConfig,
}: {
  pageConfig?: GetPageConfigQuery['getPageConfig'];
}) {
  const { actions } = useEditor();
  const [initialized, setInitialized] = React.useState(false);

  const pageConfigData = useFragment(PageConfigFragmentFragmentDoc, pageConfig);

  React.useEffect(() => {
    if (initialized) return;
    if (!pageConfigData?.sections?.length) return;

    try {
      const nodes = sectionsToNodes(pageConfigData.sections as PageSection[]);
      actions.deserialize(JSON.stringify(nodes));
    } catch (e) {
      console.error('Failed to deserialize pageConfig sections', e);
    }

    setInitialized(true);
  }, [pageConfigData, initialized, actions]);

  return <Frame />;
}
