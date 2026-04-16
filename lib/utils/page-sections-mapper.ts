/**
 * Mapper between PageSection[] (backend canonical format) and Craft.js node map.
 *
 * PageSection[] is the source of truth stored in lemonade-backend.
 * Craft.js node map is the in-memory format used by the editor.
 *
 * Load:  pageconfig.sections[] → sectionsToNodes() → actions.deserialize()
 * Save:  actions.serialize()   → nodesToSections() → updatePageConfig({ sections })
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageSection {
  id: string;
  type: string;
  order: number;
  hidden: boolean;
  layout: { width: string; padding: string };
  props: Record<string, unknown>;
  craft_node_id: string;
  children?: PageSection[];
}

export interface CraftNode {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: Record<string, unknown>;
  nodes: string[];
  linkedNodes: Record<string, string>;
  parent: string | null;
  displayName: string;
  custom: Record<string, unknown>;
  hidden?: boolean;
}

// ─── SectionType → CraftJS resolvedName ──────────────────────────────────────

const TYPE_TO_RESOLVED: Record<string, string> = {
  layout_container: 'Container',
  columns: 'Grid',
  layout_col: 'Col',
  tabs: 'Tabs',
  tab_item: 'Tab',
  accordion: 'Accordion',
  accordion_item: 'AccordionItem',
  event_hero: 'EventHero',
  event_registration: 'EventAccess',
  event_about: 'AboutSection',
  event_location: 'LocationSection',
  event_schedule: 'SubEventSection',
  event_gallery: 'GallerySection',
  event_collectibles: 'EventCollectibles',
  event_datetime: 'EventDateTimeBlock',
  event_location_block: 'EventLocationBlock',
  event_community: 'CommunitySection',
  event_hosted_by: 'HostedBySection',
  event_attendees: 'AttendeesSection',
  event_sidebar_image: 'EventSidebarImage',
  rich_text: 'RichText',
  image_banner: 'ImageBanner',
  video_embed: 'VideoEmbed',
  social_links: 'SocialLinks',
  custom_html: 'CustomHTML',
  spacer: 'Spacer',
  header: 'Header',
  footer: 'Footer',
  music_player: 'MusicPlayer',
  wallet_connect: 'WalletConnect',
  passport: 'Passport',
};

const RESOLVED_TO_TYPE: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_TO_RESOLVED).map(([k, v]) => [v, k]),
);

const CANVAS_TYPES = new Set([
  'layout_container', 'columns', 'layout_col', 'tabs', 'accordion',
]);

// ─── sectionsToNodes ─────────────────────────────────────────────────────────

/**
 * Convert a flat/nested PageSection[] into a Craft.js node map suitable for
 * actions.deserialize(JSON.stringify(nodes)).
 */
export function sectionsToNodes(sections: PageSection[]): Record<string, CraftNode> {
  const nodes: Record<string, CraftNode> = {};

  function addSection(section: PageSection, parentId: string | null): void {
    const resolvedName = TYPE_TO_RESOLVED[section.type] ?? section.type;
    const nodeId = section.craft_node_id || section.id;
    const childIds = (section.children ?? [])
      .sort((a, b) => a.order - b.order)
      .map((c) => c.craft_node_id || c.id);

    nodes[nodeId] = {
      type: { resolvedName },
      isCanvas: CANVAS_TYPES.has(section.type),
      props: { ...section.props },
      nodes: childIds,
      linkedNodes: {},
      parent: parentId,
      displayName: resolvedName,
      custom: {},
      hidden: section.hidden,
    };

    for (const child of section.children ?? []) {
      addSection(child, nodeId);
    }
  }

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  // Find the root container; fall back to building a default layout if absent
  const rootSection = sorted.find((s) => s.type === 'layout_container');

  if (rootSection) {
    addSection(rootSection, null);
    // Top-level non-container sections that have no parent yet
    for (const s of sorted) {
      if (s.type !== 'layout_container' && !nodes[s.craft_node_id || s.id]) {
        addSection(s, null);
      }
    }
  } else {
    // No explicit container — wrap in default two-column layout
    nodes['ROOT'] = buildDefaultContainer();
    nodes['main-grid'] = buildDefaultGrid();
    nodes['sidebar-col'] = buildDefaultSidebarCol();
    nodes['main-col'] = {
      type: { resolvedName: 'Col' },
      isCanvas: true,
      props: { width: '' },
      nodes: sorted.map((s) => s.craft_node_id || s.id),
      linkedNodes: {},
      parent: 'main-grid',
      displayName: 'Main Column',
      custom: {},
    };
    addSidebarFixedNodes(nodes);
    for (const s of sorted) {
      addSection(s, 'main-col');
    }
  }

  return nodes;
}

// ─── nodesToSections ─────────────────────────────────────────────────────────

/**
 * Convert a serialized Craft.js node map back into PageSection[].
 * Called on save to persist the canonical representation.
 */
export function nodesToSections(serialized: string): PageSection[] {
  const nodes: Record<string, CraftNode> = JSON.parse(serialized);

  function nodeToSection(nodeId: string, order: number): PageSection | null {
    const node = nodes[nodeId];
    if (!node) return null;

    const type = RESOLVED_TO_TYPE[node.type.resolvedName];
    if (!type) return null; // unknown component — skip

    const children = (node.nodes ?? [])
      .map((childId, idx) => nodeToSection(childId, idx))
      .filter((s): s is PageSection => s !== null);

    return {
      id: nodeId,
      type,
      order,
      hidden: node.hidden ?? false,
      layout: {
        width: (node.props?.layout_width as string) ?? 'contained',
        padding: (node.props?.layout_padding as string) ?? 'md',
      },
      props: omit(node.props, ['layout_width', 'layout_padding']),
      craft_node_id: nodeId,
      children: children.length > 0 ? children : undefined,
    };
  }

  if (!nodes['ROOT']) return [];

  const rootSection = nodeToSection('ROOT', 0);
  return rootSection ? [rootSection] : [];
}

// ─── sectionToNodePatch ───────────────────────────────────────────────────────

/**
 * Produce a surgical update descriptor for a single section.
 * Used when section_designer tool returns a single PageSection.
 */
export function sectionToNodePatch(section: PageSection): {
  nodeId: string;
  props: Record<string, unknown>;
  isNew: boolean;
  resolvedName: string;
} {
  const nodeId = section.craft_node_id || section.id;
  const resolvedName = TYPE_TO_RESOLVED[section.type] ?? section.type;

  return { nodeId, props: section.props, isNew: false, resolvedName };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function omit(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const result = { ...obj };
  for (const k of keys) delete result[k];

  return result;
}

function buildDefaultContainer(): CraftNode {
  return {
    type: { resolvedName: 'Container' },
    isCanvas: true,
    props: { centered: false, width: '' },
    nodes: ['main-grid'],
    linkedNodes: {},
    parent: null,
    displayName: 'Container',
    custom: {},
  };
}

function buildDefaultGrid(): CraftNode {
  return {
    type: { resolvedName: 'Grid' },
    isCanvas: true,
    props: { gap: '18', centered: true, width: '1080' },
    nodes: ['sidebar-col', 'main-col'],
    linkedNodes: {},
    parent: 'ROOT',
    displayName: 'Grid',
    custom: {},
  };
}

function buildDefaultSidebarCol(): CraftNode {
  return {
    type: { resolvedName: 'Col' },
    isCanvas: true,
    props: { width: '300' },
    nodes: ['sidebar-image', 'community-section', 'hosted-by-section', 'attendees-section'],
    linkedNodes: {},
    parent: 'main-grid',
    displayName: 'Sidebar Column',
    custom: {},
  };
}

function addSidebarFixedNodes(nodes: Record<string, CraftNode>): void {
  const sidebar: Array<{ id: string; resolvedName: string; displayName: string }> = [
    { id: 'sidebar-image', resolvedName: 'EventSidebarImage', displayName: 'Event Image' },
    { id: 'community-section', resolvedName: 'CommunitySection', displayName: 'Community' },
    { id: 'hosted-by-section', resolvedName: 'HostedBySection', displayName: 'Hosted By' },
    { id: 'attendees-section', resolvedName: 'AttendeesSection', displayName: 'Attendees' },
  ];

  for (const s of sidebar) {
    nodes[s.id] = {
      type: { resolvedName: s.resolvedName },
      isCanvas: false,
      props: {},
      nodes: [],
      linkedNodes: {},
      parent: 'sidebar-col',
      displayName: s.displayName,
      custom: {},
    };
  }
}
