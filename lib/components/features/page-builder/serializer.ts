/**
 * Page Builder Serializer
 *
 * Bidirectional converter between the backend PageConfig JSON format
 * (used by GraphQL) and the Craft.js SerializedNodes tree (used by
 * the visual editor at runtime).
 *
 * Design goals:
 * - Deterministic: same input always yields the same output.
 * - Lossless round-trip: pageConfig -> craft -> pageConfig preserves data.
 * - Strict TypeScript: no `any`, uses `unknown` + type guards.
 */

import type {
  PageConfig,
  PageSection,
  SectionLayout,
  SectionType,
  DataBinding,
  DataBindingMode,
  DataSourceType,
  SectionBackground,
  SectionWidth,
  SectionPadding,
  SectionAlignment,
} from './types';
import { DEFAULT_SECTION_LAYOUT, CONTAINER_SECTIONS } from './types';
import { sectionTypeToComponent, PASCAL_TO_SECTION_TYPE } from './sections/resolver';

// ---------------------------------------------------------------------------
// Craft.js serialised-node types (kept local to avoid depending on the
// Craft.js package at the type level — these match @craftjs/core exactly).
// ---------------------------------------------------------------------------

export interface SerializedNode {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: Record<string, unknown>;
  displayName?: string;
  custom?: Record<string, unknown>;
  parent?: string;
  nodes: string[];
  linkedNodes?: Record<string, string>;
}

export type SerializedNodes = Record<string, SerializedNode>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Node ID prefix for section nodes derived from PageSection.id */
const SECTION_NODE_PREFIX = 'section-';

/** Props that belong in SectionLayout rather than in the component props bag. */
const LAYOUT_PROP_KEYS: ReadonlySet<string> = new Set([
  'width',
  'padding',
  'columns',
  'alignment',
  'min_height',
  'background',
]);

/** Props that belong in DataBinding rather than in the component props bag. */
const DATA_BINDING_PROP_KEYS: ReadonlySet<string> = new Set([
  'data_binding_mode',
  'data_source_type',
  'data_source_field',
  'data_binding_overrides',
]);

/**
 * Container section types that use Craft.js `linkedNodes` for their
 * sub-canvases (columns, tabs, accordion panels).
 */
const CONTAINER_TYPE_SET: ReadonlySet<SectionType> = new Set(CONTAINER_SECTIONS);

// ---------------------------------------------------------------------------
// Helpers — type guards
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a unique section ID.
 *
 * Uses `crypto.randomUUID()` when available (all modern runtimes including
 * Node 19+, all major browsers). Falls back to a timestamp-based ID for
 * older environments.
 */
export function generateSectionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: timestamp + random suffix (still unique enough for editor use)
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `${ts}-${rand}`;
}

/**
 * Extract `SectionLayout` fields from a flat props object.
 *
 * Any layout-related key found in `props` is pulled into a clean
 * `SectionLayout` object; missing keys fall back to `DEFAULT_SECTION_LAYOUT`.
 *
 * @param props  Flat record of component props (Craft.js style).
 * @returns      A `SectionLayout` with defaults applied for missing keys.
 */
export function serializeSectionLayout(
  props: Record<string, unknown>,
): SectionLayout {
  const layout: SectionLayout = {
    width: isString(props.width) ? (props.width as SectionWidth) : DEFAULT_SECTION_LAYOUT.width,
    padding: isString(props.padding)
      ? (props.padding as SectionPadding)
      : DEFAULT_SECTION_LAYOUT.padding,
  };

  if (isNumber(props.columns) && [1, 2, 3, 4].includes(props.columns)) {
    layout.columns = props.columns as 1 | 2 | 3 | 4;
  }

  if (isString(props.alignment)) {
    layout.alignment = props.alignment as SectionAlignment;
  }

  if (isString(props.min_height)) {
    layout.min_height = props.min_height;
  }

  if (isRecord(props.background)) {
    layout.background = props.background as SectionBackground;
  }

  return layout;
}

/**
 * Flatten a `SectionLayout` into a props record for Craft.js component
 * consumption.
 *
 * @param layout  The section layout to flatten.
 * @returns       A record of key/value pairs suitable for spreading into
 *                component props.
 */
export function deserializeSectionLayout(
  layout: SectionLayout,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  result.width = layout.width;
  result.padding = layout.padding;

  if (layout.columns !== undefined) {
    result.columns = layout.columns;
  }
  if (layout.alignment !== undefined) {
    result.alignment = layout.alignment;
  }
  if (layout.min_height !== undefined) {
    result.min_height = layout.min_height;
  }
  if (layout.background !== undefined) {
    result.background = layout.background;
  }

  return result;
}

/**
 * Convert a backend `PageConfig` into a Craft.js `SerializedNodes` tree.
 *
 * The resulting tree has a `ROOT` canvas node whose children correspond to
 * the visible (and hidden) sections of the page, sorted by `order`.
 *
 * Hidden sections are still included in the tree so that toggling visibility
 * does not require a full re-serialisation. They are flagged via the
 * `custom.hidden` property on the Craft.js node.
 *
 * @param config  The PageConfig retrieved from the backend.
 * @returns       A `SerializedNodes` object ready for Craft.js `<Frame>`.
 */
export function pageConfigToCraftState(config: PageConfig): SerializedNodes {
  const nodes: SerializedNodes = {};

  // Sort sections by order for deterministic child ordering.
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  // Build child node IDs for ROOT.
  const rootChildIds: string[] = [];

  for (const section of sortedSections) {
    const nodeId = `${SECTION_NODE_PREFIX}${section.id}`;
    rootChildIds.push(nodeId);
    buildSectionNode(nodes, section, nodeId, 'ROOT');
  }

  // ROOT node — the top-level canvas.
  nodes['ROOT'] = {
    type: { resolvedName: 'Canvas' },
    isCanvas: true,
    props: {},
    displayName: 'Canvas',
    custom: {},
    nodes: rootChildIds,
  };

  return nodes;
}

/**
 * Convert Craft.js `SerializedNodes` back into a `PageConfig`.
 *
 * Non-section fields (theme, seo, custom_code, etc.) are preserved from
 * `existingConfig`. The `sections` array and `updated_at` timestamp are
 * replaced.
 *
 * @param craftNodes      The serialised Craft.js node tree.
 * @param existingConfig  The current PageConfig (used to carry forward
 *                        non-section fields).
 * @returns               A new `PageConfig` with sections rebuilt from the
 *                        Craft.js state.
 */
export function craftStateToPageConfig(
  craftNodes: SerializedNodes,
  existingConfig: PageConfig,
): PageConfig {
  const rootNode = craftNodes['ROOT'];
  if (!rootNode) {
    return {
      ...existingConfig,
      sections: [],
      updated_at: new Date().toISOString(),
    };
  }

  const sections: PageSection[] = [];

  for (let order = 0; order < rootNode.nodes.length; order++) {
    const childNodeId = rootNode.nodes[order];
    const section = buildPageSection(craftNodes, childNodeId, order);
    if (section) {
      sections.push(section);
    }
  }

  return {
    ...existingConfig,
    sections,
    updated_at: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Internal — PageConfig -> Craft.js
// ---------------------------------------------------------------------------

/**
 * Recursively creates a `SerializedNode` for a `PageSection` and its
 * children, inserting all resulting nodes into `nodes`.
 */
function buildSectionNode(
  nodes: SerializedNodes,
  section: PageSection,
  nodeId: string,
  parentId: string,
): void {
  const componentName = resolveComponentName(section.type);
  const isContainer = CONTAINER_TYPE_SET.has(section.type);

  // Merge layout props + section props + data binding props into flat props.
  const flatProps: Record<string, unknown> = {
    ...deserializeSectionLayout(section.layout),
    ...section.props,
    ...flattenDataBinding(section.data_binding),
  };

  // Custom metadata stored on the Craft.js node (not passed as React props).
  const custom: Record<string, unknown> = {
    sectionId: section.id,
    sectionType: section.type,
    hidden: section.hidden,
  };

  const childNodeIds: string[] = [];
  const linkedNodes: Record<string, string> = {};

  if (isContainer && section.children && section.children.length > 0) {
    // Container sections use linkedNodes for their sub-canvases.
    const canvasComponentName = getContainerCanvasName(section.type);

    for (let i = 0; i < section.children.length; i++) {
      const child = section.children[i];
      const canvasNodeId = `${nodeId}-canvas-${i}`;
      const linkedNodeKey = getLinkedNodeKey(section.type, i);

      linkedNodes[linkedNodeKey] = canvasNodeId;

      // Create the canvas sub-node.
      const canvasChildIds: string[] = [];

      // If the child section itself has children (nested sections inside a
      // column/tab/panel), add those as children of the canvas node.
      if (child.children && child.children.length > 0) {
        const sortedChildren = [...child.children].sort((a, b) => a.order - b.order);
        for (const nested of sortedChildren) {
          const nestedNodeId = `${SECTION_NODE_PREFIX}${nested.id}`;
          canvasChildIds.push(nestedNodeId);
          buildSectionNode(nodes, nested, nestedNodeId, canvasNodeId);
        }
      }

      nodes[canvasNodeId] = {
        type: { resolvedName: canvasComponentName },
        isCanvas: true,
        props: { ...child.props },
        displayName: canvasComponentName,
        custom: {
          sectionId: child.id,
          sectionType: child.type,
        },
        parent: nodeId,
        nodes: canvasChildIds,
      };
    }
  } else if (!isContainer && section.children && section.children.length > 0) {
    // Non-container sections with children: add children as direct child nodes.
    const sortedChildren = [...section.children].sort((a, b) => a.order - b.order);
    for (const child of sortedChildren) {
      const childNodeId = `${SECTION_NODE_PREFIX}${child.id}`;
      childNodeIds.push(childNodeId);
      buildSectionNode(nodes, child, childNodeId, nodeId);
    }
  }

  nodes[nodeId] = {
    type: { resolvedName: componentName },
    isCanvas: isContainer,
    props: flatProps,
    displayName: componentName,
    custom,
    parent: parentId,
    nodes: childNodeIds,
    ...(Object.keys(linkedNodes).length > 0 ? { linkedNodes } : {}),
  };
}

/**
 * Flatten a `DataBinding` object into props that Craft.js components can
 * consume directly.
 */
function flattenDataBinding(
  binding: DataBinding | undefined,
): Record<string, unknown> {
  if (!binding) return {};

  const result: Record<string, unknown> = {};
  result.data_binding_mode = binding.mode;

  if (binding.source) {
    result.data_source_type = binding.source.type;
    if (binding.source.field !== undefined) {
      result.data_source_field = binding.source.field;
    }
  }

  if (binding.overrides !== undefined) {
    result.data_binding_overrides = binding.overrides;
  }

  return result;
}

/**
 * Return the PascalCase component name for a section type.
 * Falls back to `PlaceholderSection` for unknown types.
 */
function resolveComponentName(type: SectionType): string {
  const name = sectionTypeToComponent[type];
  return name ?? 'PlaceholderSection';
}

/**
 * Return the PascalCase canvas sub-component name for a container type.
 */
function getContainerCanvasName(type: SectionType): string {
  switch (type) {
    case 'columns':
      return 'ColumnCanvas';
    case 'tabs':
      return 'TabCanvas';
    case 'accordion':
      return 'AccordionPanelCanvas';
    default:
      return 'ColumnCanvas';
  }
}

/**
 * Return the Craft.js `linkedNodes` key for a container's sub-canvas
 * at the given index. This must match the `id` prop passed to `<Element>`
 * in the container component's render method.
 */
function getLinkedNodeKey(type: SectionType, index: number): string {
  switch (type) {
    case 'columns':
      return `column-${index}`;
    case 'tabs':
      return `tab-content-${index}`;
    case 'accordion':
      return `accordion-panel-${index}`;
    default:
      return `child-${index}`;
  }
}

// ---------------------------------------------------------------------------
// Internal — Craft.js -> PageConfig
// ---------------------------------------------------------------------------

/**
 * Build a `PageSection` from a Craft.js node and its descendants.
 *
 * Returns `null` if the node does not exist in the tree (defensive).
 */
function buildPageSection(
  nodes: SerializedNodes,
  nodeId: string,
  order: number,
): PageSection | null {
  const node = nodes[nodeId];
  if (!node) return null;

  const sectionType = resolveSectionType(node);
  const sectionId = resolveSectionId(node, nodeId);
  const hidden = resolveHidden(node);

  // Separate layout, data-binding, and component props.
  const { layoutProps, bindingProps, componentProps } = separateProps(node.props);

  const layout = serializeSectionLayout(layoutProps);
  const dataBinding = reconstructDataBinding(bindingProps);

  const section: PageSection = {
    id: sectionId,
    type: sectionType,
    order,
    hidden,
    layout,
    props: componentProps,
    craft_node_id: nodeId,
  };

  if (dataBinding) {
    section.data_binding = dataBinding;
  }

  // Process children from container linkedNodes or direct child nodes.
  const isContainer = CONTAINER_TYPE_SET.has(sectionType);

  if (isContainer && node.linkedNodes && Object.keys(node.linkedNodes).length > 0) {
    section.children = buildContainerChildren(nodes, node.linkedNodes);
  } else if (node.nodes.length > 0) {
    const children: PageSection[] = [];
    for (let i = 0; i < node.nodes.length; i++) {
      const child = buildPageSection(nodes, node.nodes[i], i);
      if (child) children.push(child);
    }
    if (children.length > 0) {
      section.children = children;
    }
  }

  return section;
}

/**
 * Build children array from a container's linkedNodes (columns, tabs, panels).
 *
 * Each linked canvas node becomes a PageSection whose own children are the
 * sections dropped inside that canvas.
 */
function buildContainerChildren(
  nodes: SerializedNodes,
  linkedNodes: Record<string, string>,
): PageSection[] {
  // Sort linkedNodes by their key to maintain deterministic ordering.
  // Keys are like "column-0", "column-1", "tab-content-0", etc.
  const sortedEntries = Object.entries(linkedNodes).sort(([keyA], [keyB]) => {
    const indexA = extractTrailingIndex(keyA);
    const indexB = extractTrailingIndex(keyB);
    return indexA - indexB;
  });

  const children: PageSection[] = [];

  for (let i = 0; i < sortedEntries.length; i++) {
    const [, canvasNodeId] = sortedEntries[i];
    const canvasNode = nodes[canvasNodeId];
    if (!canvasNode) continue;

    const canvasSectionId = resolveSectionId(canvasNode, canvasNodeId);

    // Nested sections inside this canvas.
    const nested: PageSection[] = [];
    for (let j = 0; j < canvasNode.nodes.length; j++) {
      const nestedSection = buildPageSection(nodes, canvasNode.nodes[j], j);
      if (nestedSection) nested.push(nestedSection);
    }

    const childSection: PageSection = {
      id: canvasSectionId,
      type: resolveSectionType(canvasNode),
      order: i,
      hidden: false,
      layout: { ...DEFAULT_SECTION_LAYOUT },
      props: { ...canvasNode.props },
    };

    if (nested.length > 0) {
      childSection.children = nested;
    }

    children.push(childSection);
  }

  return children;
}

/**
 * Extract the trailing numeric index from a linkedNode key.
 * E.g. "column-2" -> 2, "tab-content-0" -> 0.
 */
function extractTrailingIndex(key: string): number {
  const match = key.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Determine the SectionType from a Craft.js node.
 *
 * Checks `custom.sectionType` first (set during pageConfigToCraftState),
 * then falls back to reverse-mapping the component name. If neither works,
 * defaults to `'rich_text'` as a safe universal type.
 */
function resolveSectionType(node: SerializedNode): SectionType {
  // Prefer the stored sectionType in custom data.
  if (node.custom && isString(node.custom.sectionType)) {
    return node.custom.sectionType as SectionType;
  }

  // Reverse-map from PascalCase component name.
  const componentName = node.type.resolvedName;
  const mapped = PASCAL_TO_SECTION_TYPE[componentName];
  if (mapped) return mapped;

  // Canvas sub-components are not section types themselves; map to their
  // parent container type if possible.
  switch (componentName) {
    case 'ColumnCanvas':
      return 'columns';
    case 'TabCanvas':
      return 'tabs';
    case 'AccordionPanelCanvas':
      return 'accordion';
    default:
      return 'rich_text';
  }
}

/**
 * Resolve the PageSection ID from a Craft.js node.
 *
 * Uses `custom.sectionId` if present, otherwise strips the node prefix
 * to recover the original ID.
 */
function resolveSectionId(node: SerializedNode, nodeId: string): string {
  if (node.custom && isString(node.custom.sectionId)) {
    return node.custom.sectionId;
  }

  // Strip the prefix if present.
  if (nodeId.startsWith(SECTION_NODE_PREFIX)) {
    return nodeId.slice(SECTION_NODE_PREFIX.length);
  }

  // Generate a new ID as last resort.
  return generateSectionId();
}

/**
 * Resolve the hidden flag from a Craft.js node's custom metadata.
 */
function resolveHidden(node: SerializedNode): boolean {
  if (node.custom && isBoolean(node.custom.hidden)) {
    return node.custom.hidden;
  }
  return false;
}

/**
 * Separate a flat Craft.js props object into layout props, data-binding
 * props, and remaining component props.
 */
function separateProps(props: Record<string, unknown>): {
  layoutProps: Record<string, unknown>;
  bindingProps: Record<string, unknown>;
  componentProps: Record<string, unknown>;
} {
  const layoutProps: Record<string, unknown> = {};
  const bindingProps: Record<string, unknown> = {};
  const componentProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (LAYOUT_PROP_KEYS.has(key)) {
      layoutProps[key] = value;
    } else if (DATA_BINDING_PROP_KEYS.has(key)) {
      bindingProps[key] = value;
    } else {
      componentProps[key] = value;
    }
  }

  return { layoutProps, bindingProps, componentProps };
}

/**
 * Reconstruct a `DataBinding` object from flat data-binding props.
 *
 * Returns `undefined` if no data-binding props are present.
 */
function reconstructDataBinding(
  bindingProps: Record<string, unknown>,
): DataBinding | undefined {
  const mode = bindingProps.data_binding_mode;
  if (!isString(mode)) return undefined;

  const binding: DataBinding = {
    mode: mode as DataBindingMode,
  };

  const sourceType = bindingProps.data_source_type;
  if (isString(sourceType)) {
    binding.source = {
      type: sourceType as DataSourceType,
    };

    const sourceField = bindingProps.data_source_field;
    if (isString(sourceField)) {
      binding.source.field = sourceField;
    }
  }

  const overrides = bindingProps.data_binding_overrides;
  if (isRecord(overrides)) {
    binding.overrides = overrides;
  }

  return binding;
}
