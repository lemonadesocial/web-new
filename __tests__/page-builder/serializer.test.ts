import { expect, it, describe } from 'vitest';
import {
  pageConfigToCraftState,
  craftStateToPageConfig,
  generateSectionId,
  type SerializedNodes,
} from '$lib/components/features/page-builder/serializer';
import type { PageConfig, PageSection } from '$lib/components/features/page-builder/types';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const TEST_CONFIG: PageConfig = {
  _id: 'test-config-1',
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
      props: { title: 'My Event', cta_text: 'Register Now' },
    },
    {
      id: 'section-2',
      type: 'rich_text',
      order: 1,
      hidden: false,
      layout: { width: 'contained', padding: 'md' },
      props: { content: '<p>Hello World</p>' },
    },
  ],
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Page Builder Serializer', () => {
  describe('pageConfigToCraftState', () => {
    it('produces a ROOT node with correct children', () => {
      const nodes = pageConfigToCraftState(TEST_CONFIG);

      expect(nodes['ROOT']).toBeDefined();
      expect(nodes['ROOT'].type.resolvedName).toBe('Canvas');
      expect(nodes['ROOT'].isCanvas).toBe(true);
      expect(nodes['ROOT'].nodes).toHaveLength(2);
      expect(nodes['ROOT'].nodes).toEqual(['section-section-1', 'section-section-2']);
    });

    it('maps section types to PascalCase component names', () => {
      const nodes = pageConfigToCraftState(TEST_CONFIG);

      const heroNode = nodes['section-section-1'];
      expect(heroNode).toBeDefined();
      expect(heroNode.type.resolvedName).toBe('EventHero');

      const richTextNode = nodes['section-section-2'];
      expect(richTextNode).toBeDefined();
      expect(richTextNode.type.resolvedName).toBe('RichText');
    });

    it('preserves layout props as flat props', () => {
      const nodes = pageConfigToCraftState(TEST_CONFIG);

      const heroNode = nodes['section-section-1'];
      expect(heroNode.props.width).toBe('full');
      expect(heroNode.props.padding).toBe('xl');

      const richTextNode = nodes['section-section-2'];
      expect(richTextNode.props.width).toBe('contained');
      expect(richTextNode.props.padding).toBe('md');
    });

    it('preserves data_binding as flat props', () => {
      const configWithBinding: PageConfig = {
        ...TEST_CONFIG,
        sections: [
          {
            id: 'section-db',
            type: 'event_about',
            order: 0,
            hidden: false,
            layout: { width: 'contained', padding: 'md' },
            props: {},
            data_binding: {
              mode: 'auto',
              source: { type: 'event', field: 'description' },
              overrides: { fallback: 'No description' },
            },
          },
        ],
      };

      const nodes = pageConfigToCraftState(configWithBinding);
      const aboutNode = nodes['section-section-db'];

      expect(aboutNode.props.data_binding_mode).toBe('auto');
      expect(aboutNode.props.data_source_type).toBe('event');
      expect(aboutNode.props.data_source_field).toBe('description');
      expect(aboutNode.props.data_binding_overrides).toEqual({ fallback: 'No description' });
    });

    it('handles hidden sections', () => {
      const configWithHidden: PageConfig = {
        ...TEST_CONFIG,
        sections: [
          {
            id: 'hidden-1',
            type: 'spacer',
            order: 0,
            hidden: true,
            layout: { width: 'full', padding: 'none' },
            props: {},
          },
        ],
      };

      const nodes = pageConfigToCraftState(configWithHidden);
      const spacerNode = nodes['section-hidden-1'];

      expect(spacerNode).toBeDefined();
      expect(spacerNode.custom?.hidden).toBe(true);
      // Hidden sections still appear in ROOT children
      expect(nodes['ROOT'].nodes).toContain('section-hidden-1');
    });

    it('handles container sections with linkedNodes', () => {
      const configWithContainer: PageConfig = {
        ...TEST_CONFIG,
        sections: [
          {
            id: 'cols-1',
            type: 'columns',
            order: 0,
            hidden: false,
            layout: { width: 'contained', padding: 'md', columns: 2 },
            props: {},
            children: [
              {
                id: 'col-child-0',
                type: 'columns',
                order: 0,
                hidden: false,
                layout: { width: 'contained', padding: 'md' },
                props: {},
              },
              {
                id: 'col-child-1',
                type: 'columns',
                order: 1,
                hidden: false,
                layout: { width: 'contained', padding: 'md' },
                props: {},
              },
            ],
          },
        ],
      };

      const nodes = pageConfigToCraftState(configWithContainer);
      const columnsNode = nodes['section-cols-1'];

      expect(columnsNode).toBeDefined();
      expect(columnsNode.isCanvas).toBe(true);
      expect(columnsNode.linkedNodes).toBeDefined();
      expect(columnsNode.linkedNodes!['column-0']).toBe('section-cols-1-canvas-0');
      expect(columnsNode.linkedNodes!['column-1']).toBe('section-cols-1-canvas-1');

      // Canvas sub-nodes should exist
      const canvas0 = nodes['section-cols-1-canvas-0'];
      expect(canvas0).toBeDefined();
      expect(canvas0.isCanvas).toBe(true);
      expect(canvas0.type.resolvedName).toBe('ColumnCanvas');
      expect(canvas0.parent).toBe('section-cols-1');
    });
  });

  describe('craftStateToPageConfig', () => {
    it('rebuilds sections from Craft.js nodes', () => {
      const craftNodes = pageConfigToCraftState(TEST_CONFIG);
      const rebuilt = craftStateToPageConfig(craftNodes, TEST_CONFIG);

      expect(rebuilt.sections).toHaveLength(2);
      expect(rebuilt.sections[0].type).toBe('event_hero');
      expect(rebuilt.sections[0].id).toBe('section-1');
      expect(rebuilt.sections[0].order).toBe(0);
      expect(rebuilt.sections[1].type).toBe('rich_text');
      expect(rebuilt.sections[1].id).toBe('section-2');
      expect(rebuilt.sections[1].order).toBe(1);
    });

    it('preserves non-section fields from existingConfig', () => {
      const craftNodes = pageConfigToCraftState(TEST_CONFIG);
      const rebuilt = craftStateToPageConfig(craftNodes, TEST_CONFIG);

      expect(rebuilt._id).toBe('test-config-1');
      expect(rebuilt.owner_type).toBe('event');
      expect(rebuilt.owner_id).toBe('event-1');
      expect(rebuilt.created_by).toBe('user-1');
      expect(rebuilt.status).toBe('draft');
      expect(rebuilt.version).toBe(1);
      expect(rebuilt.theme).toEqual(TEST_CONFIG.theme);
      expect(rebuilt.created_at).toBe('2025-01-01T00:00:00Z');
      // updated_at is refreshed
      expect(rebuilt.updated_at).not.toBe('2025-01-01T00:00:00Z');
    });
  });

  describe('Round-trip', () => {
    it('pageConfig -> craft -> pageConfig preserves data', () => {
      const craftNodes = pageConfigToCraftState(TEST_CONFIG);
      const rebuilt = craftStateToPageConfig(craftNodes, TEST_CONFIG);

      expect(rebuilt.sections).toHaveLength(TEST_CONFIG.sections.length);

      for (let i = 0; i < TEST_CONFIG.sections.length; i++) {
        const original = TEST_CONFIG.sections[i];
        const result = rebuilt.sections[i];

        expect(result.id).toBe(original.id);
        expect(result.type).toBe(original.type);
        expect(result.order).toBe(original.order);
        expect(result.hidden).toBe(original.hidden);

        // Layout should match
        expect(result.layout.width).toBe(original.layout.width);
        expect(result.layout.padding).toBe(original.layout.padding);

        // Component props should match
        for (const [key, value] of Object.entries(original.props)) {
          expect(result.props[key]).toEqual(value);
        }
      }
    });

    it('round-trips data binding correctly', () => {
      const configWithBinding: PageConfig = {
        ...TEST_CONFIG,
        sections: [
          {
            id: 'db-section',
            type: 'event_about',
            order: 0,
            hidden: false,
            layout: { width: 'contained', padding: 'lg' },
            props: { subtitle: 'About' },
            data_binding: {
              mode: 'auto',
              source: { type: 'event', field: 'description' },
            },
          },
        ],
      };

      const craftNodes = pageConfigToCraftState(configWithBinding);
      const rebuilt = craftStateToPageConfig(craftNodes, configWithBinding);

      expect(rebuilt.sections[0].data_binding).toBeDefined();
      expect(rebuilt.sections[0].data_binding!.mode).toBe('auto');
      expect(rebuilt.sections[0].data_binding!.source?.type).toBe('event');
      expect(rebuilt.sections[0].data_binding!.source?.field).toBe('description');
    });
  });

  describe('Edge cases', () => {
    it('empty sections array produces ROOT with no children', () => {
      const emptyConfig: PageConfig = {
        ...TEST_CONFIG,
        sections: [],
      };

      const nodes = pageConfigToCraftState(emptyConfig);

      expect(nodes['ROOT']).toBeDefined();
      expect(nodes['ROOT'].nodes).toHaveLength(0);
      expect(Object.keys(nodes)).toHaveLength(1); // Only ROOT
    });

    it('craftStateToPageConfig handles missing ROOT node', () => {
      const emptyNodes: SerializedNodes = {};
      const result = craftStateToPageConfig(emptyNodes, TEST_CONFIG);

      expect(result.sections).toHaveLength(0);
      expect(result._id).toBe(TEST_CONFIG._id);
    });
  });

  describe('generateSectionId', () => {
    it('produces unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateSectionId());
      }
      expect(ids.size).toBe(100);
    });

    it('produces string IDs', () => {
      const id = generateSectionId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });
});
