// Page Builder Types
// Manual types matching PRD + backend GraphQL schema.
// Replace with generated types once codegen runs against backend branch.

export type PageConfigStatus = 'draft' | 'published' | 'archived';
export type OwnerType = 'event' | 'space';
export type ThemeMode = 'dark' | 'light' | 'auto';
export type ThemeType = 'minimal' | 'shader' | 'pattern' | 'image' | 'custom';
export type SectionWidth = 'full' | 'contained' | 'narrow';
export type SectionPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionAlignment = 'left' | 'center' | 'right';
export type DataBindingMode = 'auto' | 'manual';
export type DataSourceType = 'event' | 'space' | 'manual';
export type BackgroundType = 'color' | 'image' | 'gradient';
export type ThemeBackgroundType = 'color' | 'shader' | 'pattern' | 'image' | 'video';
export type EffectType = 'video' | 'float' | 'particles' | 'none';
export type ScriptStrategy = 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
export type StructuredDataType = 'Event' | 'Organization' | 'WebPage';
export type DevicePreview = 'desktop' | 'tablet' | 'mobile';

export type SectionType =
  // Event-specific
  | 'event_hero'
  | 'event_registration'
  | 'event_about'
  | 'event_schedule'
  | 'event_speakers'
  | 'event_location'
  | 'event_sponsors'
  | 'event_faq'
  | 'event_gallery'
  | 'event_collectibles'
  | 'event_countdown'
  // Space-specific
  | 'space_hero'
  | 'space_events'
  | 'space_members'
  | 'space_feed'
  | 'space_about'
  | 'space_launchpad'
  | 'space_coin'
  | 'space_collectibles'
  | 'space_hubs'
  // Universal
  | 'rich_text'
  | 'image_banner'
  | 'video_embed'
  | 'cta_block'
  | 'cards_grid'
  | 'testimonials'
  | 'social_links'
  | 'custom_html'
  | 'spacer'
  | 'header'
  | 'footer'
  | 'music_player'
  | 'wallet_connect'
  | 'passport'
  // Containers
  | 'columns'
  | 'tabs'
  | 'accordion';

export type SectionCategory = 'event' | 'space' | 'universal' | 'container';

export type SubscriptionTier = 'free' | 'pro' | 'plus' | 'max' | 'enterprise';

export type TemplateCategory =
  | 'conference'
  | 'festival'
  | 'meetup'
  | 'workshop'
  | 'concert'
  | 'networking'
  | 'community'
  | 'dao'
  | 'brand'
  | 'portfolio'
  | 'minimal'
  | 'premium'
  | 'custom';

export type TemplateTarget = 'event' | 'space' | 'universal';
export type TemplateVisibility = 'public' | 'private' | 'unlisted';
export type TemplateCreatorType = 'platform' | 'designer' | 'community';

// --- Core Data Structures ---

export interface ThemeFont {
  family: string;
  url?: string;
  weight?: number;
  size_scale?: number;
}

export interface ThemeColors {
  accent: string;
  background: string;
  card: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  [key: string]: string;
}

export interface ThemeBackground {
  type: ThemeBackgroundType;
  value: string;
  config?: Record<string, unknown>;
}

export interface ThemeEffect {
  type: EffectType;
  value?: string;
  config?: Record<string, unknown>;
}

export interface ThemeConfig {
  mode: ThemeMode;
  type: ThemeType;
  colors: ThemeColors;
  fonts: {
    title: ThemeFont;
    body: ThemeFont;
  };
  background?: ThemeBackground;
  effects?: ThemeEffect;
  css_variables?: Record<string, string>;
}

export interface SectionBackground {
  type: BackgroundType;
  value: string;
}

export interface SectionLayout {
  width: SectionWidth;
  padding: SectionPadding;
  columns?: 1 | 2 | 3 | 4;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
}

export interface DataBinding {
  mode: DataBindingMode;
  source?: {
    type: DataSourceType;
    field?: string;
  };
  overrides?: Record<string, unknown>;
}

export interface PageSection {
  id: string;
  type: SectionType;
  order: number;
  hidden: boolean;
  layout: SectionLayout;
  props: Record<string, unknown>;
  data_binding?: DataBinding;
  children?: PageSection[];
  craft_node_id?: string;
}

export interface CustomCodeScript {
  src?: string;
  content?: string;
  strategy: ScriptStrategy;
}

export interface CustomCode {
  css?: string;
  head_html?: string;
  body_html?: string;
  scripts?: CustomCodeScript[];
}

export interface StructuredData {
  type: StructuredDataType;
  custom?: Record<string, unknown>;
}

export interface SEOConfig {
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  og_type?: string;
  canonical_url?: string;
  no_index?: boolean;
  structured_data?: StructuredData;
}

export interface PreviewLink {
  id: string;
  token: string;
  expires_at?: string;
  created_by: string;
  created_at: string;
  view_count: number;
}

export interface PageConfig {
  _id: string;
  owner_type: OwnerType;
  owner_id: string;
  created_by: string;
  space_id?: string;
  status: PageConfigStatus;
  version: number;
  published_version?: number;
  theme: ThemeConfig;
  sections: PageSection[];
  custom_code?: CustomCode;
  seo?: SEOConfig;
  name?: string;
  description?: string;
  thumbnail_url?: string;
  template_id?: string;
  template_version_installed?: string;
  preview_links?: PreviewLink[];
  locked_by?: string;
  locked_at?: string;
  last_edited_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ConfigVersion {
  _id: string;
  config_id: string;
  version: number;
  snapshot: PageConfig;
  change_summary?: string;
  created_by: string;
  created_at: string;
}

export interface LockResult {
  success: boolean;
  locked_by?: string;
  locked_at?: string;
  message?: string;
}

export interface PreviewLinkResponse {
  id: string;
  token: string;
  url: string;
  expires_at?: string;
}

export interface SectionCatalogItem {
  type: SectionType;
  name: string;
  description: string;
  category: SectionCategory;
  tier_required: SubscriptionTier;
}

export interface AISuggestedSection {
  type: SectionType;
  name: string;
  description: string;
  props: Record<string, unknown>;
  layout: SectionLayout;
}

// --- Template Types ---

export interface TemplateChangelog {
  version: string;
  date: string;
  summary: string;
  breaking_changes?: boolean;
}

export interface Template {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  config: PageConfig;
  thumbnail_url: string;
  preview_urls?: string[];
  preview_video_url?: string;
  creator_type: TemplateCreatorType;
  creator_id: string;
  space_id?: string;
  target: TemplateTarget;
  visibility: TemplateVisibility;
  subscription_tier_min: SubscriptionTier;
  marketplace_listed: boolean;
  price_cents?: number;
  currency?: string;
  install_count: number;
  rating_average: number;
  rating_count: number;
  version: string;
  changelog?: TemplateChangelog[];
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface TemplateUpdateInfo {
  has_update: boolean;
  current_version?: string;
  latest_version?: string;
  changelog?: TemplateChangelog[];
}

// --- Asset Types ---

export interface SpaceAsset {
  _id: string;
  stamp?: string;
  state?: string;
  owner?: string;
  type?: string;
  size?: number;
  url: string;
  bucket?: string;
  key?: string;
  description?: string;
}

export interface StockPhoto {
  id: string;
  url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  alt_text?: string;
  photographer?: string;
  photographer_url?: string;
  source?: string;
}

// --- Editor State Types ---

export interface EditorState {
  configId: string | null;
  ownerType: OwnerType;
  ownerId: string;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  isLocked: boolean;
  devicePreview: DevicePreview;
  zoom: number;
  selectedNodeId: string | null;
  activeRightPanel: RightPanelType | null;
}

export type RightPanelType =
  | 'properties'
  | 'theme'
  | 'seo'
  | 'assets'
  | 'templates'
  | 'versions'
  | 'preview-share'
  | 'code';

// Section tier access map
export const BASIC_SECTIONS: SectionType[] = [
  'event_hero',
  'event_registration',
  'event_about',
  'event_location',
  'space_hero',
  'space_events',
  'space_about',
  'rich_text',
  'image_banner',
  'cta_block',
  'spacer',
];

export const ALL_SECTIONS: SectionType[] = [
  ...BASIC_SECTIONS,
  'event_schedule',
  'event_speakers',
  'event_sponsors',
  'event_faq',
  'event_gallery',
  'event_collectibles',
  'event_countdown',
  'space_members',
  'space_feed',
  'space_launchpad',
  'space_coin',
  'space_collectibles',
  'space_hubs',
  'video_embed',
  'cards_grid',
  'testimonials',
  'social_links',
  'header',
  'footer',
  'music_player',
  'wallet_connect',
  'passport',
];

export const CONTAINER_SECTIONS: SectionType[] = ['columns', 'tabs', 'accordion'];
export const CUSTOM_CODE_SECTIONS: SectionType[] = ['custom_html'];

// Default theme for new configs
export const DEFAULT_THEME: ThemeConfig = {
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
};

// Default section layout
export const DEFAULT_SECTION_LAYOUT: SectionLayout = {
  width: 'contained',
  padding: 'md',
};
