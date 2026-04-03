'use client';
import React from 'react';
import { Frame } from '@craftjs/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { DEFAULT_LAYOUT_SECTIONS } from '$lib/utils/constants';

export function CraftableEventSections({ event, attending }: { event: Event; attending: boolean }) {
  // Map sections to their craft.js identifiers in the resolver
  const sectionMap: Record<string, string> = {
    registration: 'EventAccess',
    about: 'AboutSection',
    collectibles: 'EventCollectibles',
    location: 'LocationSection',
  };

  // Construct initial state JSON for Craft.js
  const nodes = (event.layout_sections || DEFAULT_LAYOUT_SECTIONS).reduce((acc: any, item: any) => {
    const componentName = sectionMap[item.id];
    if (!componentName) return acc;
    if (item.id === 'collectibles' && !attending) return acc;

    acc[item.id] = {
      type: { resolvedName: componentName },
      isCanvas: false,
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'ROOT',
      displayName: componentName,
      custom: {},
    };
    return acc;
  }, {});

  const json = {
    ROOT: {
      type: { resolvedName: 'Container' },
      isCanvas: true,
      props: { className: 'flex flex-col gap-6' },
      nodes: Object.keys(nodes),
      linkedNodes: {},
      parent: null,
      displayName: 'Container',
      custom: {},
    },
    ...nodes,
  };

  return <Frame data={JSON.stringify(json)} />;
}
