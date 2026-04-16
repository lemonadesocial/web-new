import { describe, expect, it } from 'vitest';

import { sectionsToNodes, type PageSection } from '$lib/utils/page-sections-mapper';

describe('page-sections-mapper', () => {
  it('attaches flat top-level non-container sections to ROOT when root.children is empty', () => {
    // This is the shape the AI page_designer tool returns:
    // root.children is [] but main-grid is a sibling in the flat array
    const sections: PageSection[] = [
      {
        id: 'root',
        type: 'layout_container',
        order: 0,
        hidden: false,
        layout: { width: 'contained', padding: 'md' },
        props: { centered: false, width: '' },
        children: [],
      },
      {
        id: 'main-grid',
        type: 'columns',
        order: 1,
        hidden: false,
        layout: { width: 'full', padding: 'none' },
        props: { gap: '18', centered: true, width: '1080' },
        children: [
          {
            id: 'main-col',
            type: 'layout_col',
            order: 0,
            hidden: false,
            layout: { width: '', padding: 'none' },
            props: {},
            children: [
              {
                id: 'event-hero',
                type: 'event_hero',
                order: 0,
                hidden: false,
                layout: { width: 'full', padding: 'lg' },
                props: {},
              },
            ],
          },
        ],
      },
    ];

    const nodes = sectionsToNodes(sections);

    expect(nodes.ROOT).toBeDefined();
    expect(nodes.ROOT.nodes).toEqual(['main-grid']);
    expect(nodes['main-grid'].parent).toBe('ROOT');
    expect(nodes['main-col'].parent).toBe('main-grid');
    expect(nodes['event-hero'].parent).toBe('main-col');
  });

  it('normalizes a layout container root to ROOT for rendering', () => {
    const sections: PageSection[] = [
      {
        id: 'root',
        type: 'layout_container',
        order: 0,
        hidden: false,
        layout: { width: 'full', padding: 'none' },
        props: { centered: false, width: '' },
        children: [
          {
            id: 'main-grid',
            type: 'columns',
            order: 0,
            hidden: false,
            layout: { width: 'full', padding: 'none' },
            props: { gap: '18', centered: true, width: '1080' },
          },
        ],
      },
    ];

    const nodes = sectionsToNodes(sections);

    expect(nodes.ROOT).toBeDefined();
    expect(nodes.root).toBeUndefined();
    expect(nodes.ROOT.parent).toBeNull();
    expect(nodes.ROOT.type.resolvedName).toBe('Container');
    expect(nodes.ROOT.nodes).toEqual(['main-grid']);
    expect(nodes['main-grid'].parent).toBe('ROOT');
  });
});
