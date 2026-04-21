import { describe, expect, it } from 'vitest';

import { nodesToSections, sectionToNodePatch, sectionsToNodes, type PageSection } from '$lib/utils/page-sections-mapper';

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

  it('preserves extended layout fields when mapping sections to nodes and back', () => {
    const section: PageSection = {
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
                  layout: {
                    width: 'full',
                    padding: 'lg',
                    alignment: 'center',
                    min_height: '420px',
                    background: { type: 'solid', value: 'green' },
                  },
                  props: { align: 'text-center' },
                },
              ],
            },
          ],
        },
      ],
    };

    const nodes = sectionsToNodes([section]);
    const patch = sectionToNodePatch(section.children![0].children![0].children![0]);
    const roundTrip = nodesToSections(JSON.stringify(nodes));

    expect(nodes['event-hero'].props).toMatchObject({
      align: 'text-center',
      layout_width: 'full',
      layout_padding: 'lg',
      layout_alignment: 'center',
      layout_min_height: '420px',
      layout_background: { type: 'solid', value: 'green' },
    });
    expect(patch.props).toMatchObject({
      layout_width: 'full',
      layout_padding: 'lg',
      layout_alignment: 'center',
      layout_min_height: '420px',
      layout_background: { type: 'solid', value: 'green' },
    });
    expect(roundTrip[0].children?.[0].children?.[0].children?.[0]).toMatchObject({
      id: 'event-hero',
      type: 'event_hero',
      layout: {
        width: 'full',
        padding: 'lg',
        alignment: 'center',
        min_height: '420px',
        background: { type: 'solid', value: 'green' },
      },
      props: { align: 'text-center' },
    });
  });

  it('maps ai_custom_section to the custom renderer and preserves html/css props', () => {
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
            id: 'ai-custom-1',
            type: 'ai_custom_section',
            order: 0,
            hidden: false,
            layout: { width: 'full', padding: 'md' },
            props: {
              html: '<div class="bubble-scene"></div>',
              css: '[data-ai-custom-section="ai-custom-1"] .bubble-scene { min-height: 320px; }',
            },
          },
        ],
      },
    ];

    const nodes = sectionsToNodes(sections);
    const roundTrip = nodesToSections(JSON.stringify(nodes));

    expect(nodes['ai-custom-1'].type.resolvedName).toBe('AICustomSection');
    expect(nodes['ai-custom-1'].props).toMatchObject({
      html: '<div class="bubble-scene"></div>',
      css: '[data-ai-custom-section="ai-custom-1"] .bubble-scene { min-height: 320px; }',
    });
    expect(roundTrip[0].children?.[0]).toMatchObject({
      id: 'ai-custom-1',
      type: 'ai_custom_section',
      props: {
        html: '<div class="bubble-scene"></div>',
        css: '[data-ai-custom-section="ai-custom-1"] .bubble-scene { min-height: 320px; }',
      },
    });
  });
});
