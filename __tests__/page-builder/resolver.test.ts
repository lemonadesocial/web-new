/**
 * resolver.test.ts
 *
 * Covers the resolver + editor runtime path:
 * - Canvas is registered in sectionResolver (ROOT node resolution)
 * - Every ROOT node produced by pageConfigToCraftState has a resolvedName
 *   that exists in sectionResolver, so Craft.js can resolve it at runtime
 */

import { expect, it, describe } from 'vitest';
import { sectionResolver } from '$lib/components/features/page-builder/sections/resolver';
import {
  pageConfigToCraftState,
} from '$lib/components/features/page-builder/serializer';
import type { PageConfig } from '$lib/components/features/page-builder/types';

const MINIMAL_CONFIG: PageConfig = {
  _id: 'test-1',
  owner_type: 'event',
  owner_id: 'event-1',
  created_by: 'user-1',
  status: 'draft',
  version: 1,
  theme: {
    mode: 'dark',
    type: 'minimal',
    colors: {
      accent: '#9333ea',
      background: '#0a0a0a',
      card: '#171717',
      text_primary: '#fafafa',
      text_secondary: '#a3a3a3',
      border: '#262626',
    },
    fonts: {
      title: { family: 'Inter', weight: 700 },
      body: { family: 'Inter', weight: 400 },
    },
  },
  sections: [
    {
      id: 'section-1',
      type: 'event_hero',
      order: 0,
      hidden: false,
      layout: { width: 'full', padding: 'xl' },
      props: {},
    },
  ],
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

describe('sectionResolver — runtime registration', () => {
  it('includes Canvas so Craft.js can resolve the ROOT node at runtime', () => {
    // Canvas MUST be in the resolver — without it, Craft.js throws when
    // loading any saved state because ROOT.type.resolvedName === "Canvas"
    expect(sectionResolver).toHaveProperty('Canvas');
    expect(sectionResolver['Canvas']).toBeTruthy();
  });

  it('ROOT node resolvedName matches a key in sectionResolver', () => {
    const nodes = pageConfigToCraftState(MINIMAL_CONFIG);
    const rootResolvedName = nodes['ROOT']?.type?.resolvedName;

    expect(rootResolvedName).toBe('Canvas');
    expect(sectionResolver).toHaveProperty(rootResolvedName);
  });

  it('every section node resolvedName is resolvable by sectionResolver', () => {
    const config: PageConfig = {
      ...MINIMAL_CONFIG,
      sections: [
        { id: 's1', type: 'event_hero', order: 0, hidden: false, layout: { width: 'full', padding: 'xl' }, props: {} },
        { id: 's2', type: 'rich_text', order: 1, hidden: false, layout: { width: 'contained', padding: 'md' }, props: {} },
        { id: 's3', type: 'space_hero', order: 2, hidden: false, layout: { width: 'full', padding: 'xl' }, props: {} },
        { id: 's4', type: 'columns', order: 3, hidden: false, layout: { width: 'contained', padding: 'md', columns: 2 }, props: {} },
      ],
    };

    const nodes = pageConfigToCraftState(config);

    for (const [nodeId, node] of Object.entries(nodes)) {
      const resolvedName = node.type?.resolvedName;
      expect(
        sectionResolver,
        `Node "${nodeId}" has resolvedName "${resolvedName}" which is missing from sectionResolver`
      ).toHaveProperty(resolvedName);
    }
  });

  it('contains all expected sub-canvas components for containers', () => {
    // Container sub-canvases must also be in resolver for nested drop zones
    expect(sectionResolver).toHaveProperty('ColumnCanvas');
    expect(sectionResolver).toHaveProperty('TabCanvas');
    expect(sectionResolver).toHaveProperty('AccordionPanelCanvas');
  });
});
