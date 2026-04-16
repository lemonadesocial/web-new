/** Matches CraftJS's serialisation format exactly so saved page configs remain compatible. */
export interface NodeRecord {
  type: { resolvedName: string };
  isCanvas: boolean;
  props: Record<string, any>;
  nodes: string[];
  linkedNodes: Record<string, string>;
  parent: string | null;
  displayName: string;
  custom: Record<string, any>;
}

export type PageNodes = Record<string, NodeRecord>;
