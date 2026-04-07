'use client';
import React from 'react';
import { Frame, Element } from '@craftjs/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { DEFAULT_LAYOUT_SECTIONS } from '$lib/utils/constants';
import { Container, Grid, Col } from './resolver';

export function CraftableEventSections({ event, attending }: { event: Event; attending: boolean }) {
  // Map sections to their craft.js identifiers in the resolver
  const sectionMap: Record<string, string> = {
    registration: 'EventAccess',
    about: 'AboutSection',
    collectibles: 'EventCollectibles',
    location: 'LocationSection',
  };

  // Construct initial state JSON for Craft.js
  const sections = (event.layout_sections || DEFAULT_LAYOUT_SECTIONS).reduce((acc: any, item: any) => {
    const componentName = sectionMap[item.id];
    if (!componentName) return acc;
    if (item.id === 'collectibles' && !attending) return acc;

    acc[item.id] = {
      type: { resolvedName: componentName },
      isCanvas: false,
      props: { event },
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
      props: { className: 'w-full' },
      nodes: ['main-grid'],
      linkedNodes: {},
      parent: null,
      displayName: 'Container',
      custom: {},
    },
    'main-grid': {
      type: { resolvedName: 'Grid' },
      isCanvas: true,
      props: { gap: '18' },
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
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'sidebar-col',
      displayName: 'Event Image',
      custom: {},
    },
    'community-section': {
      type: { resolvedName: 'CommunitySection' },
      isCanvas: false,
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'sidebar-col',
      displayName: 'Community',
      custom: {},
    },
    'hosted-by-section': {
      type: { resolvedName: 'HostedBySection' },
      isCanvas: false,
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'sidebar-col',
      displayName: 'Hosted By',
      custom: {},
    },
    'attendees-section': {
      type: { resolvedName: 'AttendeesSection' },
      isCanvas: false,
      props: { event },
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
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'main-col',
      displayName: 'Event Hero',
      custom: {},
    },
    'datetime-block': {
      type: { resolvedName: 'EventDateTimeBlock' },
      isCanvas: false,
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'main-col',
      displayName: 'Date & Time',
      custom: {},
    },
    'location-block': {
      type: { resolvedName: 'EventLocationBlock' },
      isCanvas: false,
      props: { event },
      nodes: [],
      linkedNodes: {},
      parent: 'main-col',
      displayName: 'Location Info',
      custom: {},
    },
    ...sections,
  };

  return <Frame data={JSON.stringify(json)} />;
}
