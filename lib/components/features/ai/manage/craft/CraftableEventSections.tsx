'use client';
import React from 'react';
import { useEditor, Frame, Element } from '@craftjs/core';
import { Event, GetPageConfigQuery, PageConfigFragmentFragmentDoc } from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { DEFAULT_LAYOUT_SECTIONS } from '$lib/utils/constants';
import { Container, Grid, Col } from './resolver';

export function CraftableEventSections({ 
  event, 
  attending,
  pageConfig 
}: { 
  event: Event; 
  attending: boolean;
  pageConfig?: GetPageConfigQuery['getPageConfig'];
}) {
  const { actions } = useEditor();
  const [initialized, setInitialized] = React.useState(false);

  // Map sections to their craft.js identifiers in the resolver
  const sectionMap: Record<string, string> = {
    registration: 'EventAccess',
    about: 'AboutSection',
    collectibles: 'EventCollectibles',
    location: 'LocationSection',
  };

  const pageConfigData = useFragment(PageConfigFragmentFragmentDoc, pageConfig);

  React.useEffect(() => {
    if (initialized) return;

    if (pageConfigData?.structure_data) {
      const data = typeof pageConfigData.structure_data === 'string'
        ? pageConfigData.structure_data
        : JSON.stringify(pageConfigData.structure_data);
      actions.deserialize(data);
      setInitialized(true);
      return;
    }

    // Construct initial state JSON for Craft.js if no pageConfig
    const sections = (event.layout_sections || DEFAULT_LAYOUT_SECTIONS).reduce((acc: any, item: any) => {
      const componentName = sectionMap[item.id];
      if (!componentName) return acc;
      if (item.id === 'collectibles' && !attending) return acc;

      acc[item.id] = {
        type: { resolvedName: componentName },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'main-col',
        displayName: componentName,
        custom: {},
      };
      return acc;
    }, {});

    const json = {
      ROOT: {
        type: { resolvedName: 'Container' },
        isCanvas: true,
        props: { className: 'w-full', centered: false, width: '' },
        nodes: ['main-grid'],
        linkedNodes: {},
        parent: null,
        displayName: 'Container',
        custom: {},
      },
      'main-grid': {
        type: { resolvedName: 'Grid' },
        isCanvas: true,
        props: { gap: '18', centered: true, width: '1080' },
        nodes: ['sidebar-col', 'main-col'],
        linkedNodes: {},
        parent: 'ROOT',
        displayName: 'Grid',
        custom: {},
      },
      'sidebar-col': {
        type: { resolvedName: 'Col' },
        isCanvas: true,
        props: { width: '74' },
        nodes: ['sidebar-image', 'community-section', 'hosted-by-section', 'attendees-section'],
        linkedNodes: {},
        parent: 'main-grid',
        displayName: 'Sidebar Column',
        custom: {},
      },
      'sidebar-image': {
        type: { resolvedName: 'EventSidebarImage' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'sidebar-col',
        displayName: 'Event Image',
        custom: {},
      },
      'community-section': {
        type: { resolvedName: 'CommunitySection' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'sidebar-col',
        displayName: 'Community',
        custom: {},
      },
      'hosted-by-section': {
        type: { resolvedName: 'HostedBySection' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'sidebar-col',
        displayName: 'Hosted By',
        custom: {},
      },
      'attendees-section': {
        type: { resolvedName: 'AttendeesSection' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'sidebar-col',
        displayName: 'Attendees',
        custom: {},
      },
      'main-col': {
        type: { resolvedName: 'Col' },
        isCanvas: true,
        props: { width: '' },
        nodes: ['event-hero', 'datetime-block', 'location-block', ...Object.keys(sections)],
        linkedNodes: {},
        parent: 'main-grid',
        displayName: 'Main Column',
        custom: {},
      },
      'event-hero': {
        type: { resolvedName: 'EventHero' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'main-col',
        displayName: 'Event Hero',
        custom: {},
      },
      'datetime-block': {
        type: { resolvedName: 'EventDateTimeBlock' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'main-col',
        displayName: 'Date Time Block',
        custom: {},
      },
      'location-block': {
        type: { resolvedName: 'EventLocationBlock' },
        isCanvas: false,
        props: {},
        nodes: [],
        linkedNodes: {},
        parent: 'main-col',
        displayName: 'Location Info',
        custom: {},
      },
      ...sections,
    };

    actions.deserialize(JSON.stringify(json));
    setInitialized(true);
  }, [event, attending, pageConfig, initialized, actions]);

  return <Frame />;
}
