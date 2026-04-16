import { describe, expect, it } from 'vitest';

import { sectionsToNodes, type PageSection } from '$lib/utils/page-sections-mapper';

describe('page-sections-mapper', () => {
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
