/**
 * Field Registry — declarative schema for section-specific property editors.
 *
 * Each section type maps to an array of FieldDef objects that describe which
 * props are editable, what input type to render, and any constraints.
 *
 * The renderer (SectionPropsEditor) reads these definitions and renders
 * the appropriate core input components.
 */

import type { SectionType } from '../types';

// ── Field types ──

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'number'
  | 'toggle'
  | 'select'
  | 'color';

export interface FieldDef {
  /** The prop key on the Craft.js node (must match .craft.props key) */
  key: string;
  /** Display label */
  label: string;
  /** Input type to render */
  type: FieldType;
  /** Placeholder text for text/textarea/url fields */
  placeholder?: string;
  /** Options for 'select' type */
  options?: { value: string; label: string }[];
  /** Min value for 'number' type */
  min?: number;
  /** Max value for 'number' type */
  max?: number;
  /** Group heading — first field in a group gets a divider */
  group?: string;
}

// ── Helper to skip layout props (handled by LayoutTab) ──
// Layout props: width, padding, alignment, min_height, background

// ── Event Section Fields ──

const EVENT_HERO: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', placeholder: 'Event title' },
  { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Short description' },
  { key: 'date', label: 'Date', type: 'text', placeholder: 'e.g. March 15, 2026' },
  { key: 'location', label: 'Location', type: 'text', placeholder: 'Venue or city' },
  { key: 'cover_image_url', label: 'Cover Image URL', type: 'url', placeholder: 'https://...' },
  { key: 'cta_text', label: 'CTA Button Text', type: 'text', placeholder: 'Register Now', group: 'Call to Action' },
  { key: 'cta_url', label: 'CTA Button URL', type: 'url', placeholder: 'https://...' },
  { key: 'show_date', label: 'Show Date', type: 'toggle' },
  { key: 'show_location', label: 'Show Location', type: 'toggle' },
];

const EVENT_REGISTRATION: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Registration' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Registration details' },
  { key: 'show_prices', label: 'Show Prices', type: 'toggle' },
  { key: 'show_descriptions', label: 'Show Ticket Descriptions', type: 'toggle' },
];

const EVENT_ABOUT: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'About This Event' },
  { key: 'description', label: 'Description (HTML)', type: 'textarea', placeholder: 'Event description...' },
  { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Image' },
  { key: 'image_position', label: 'Image Position', type: 'select', options: [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ]},
  { key: 'show_image', label: 'Show Image', type: 'toggle' },
];

const EVENT_SCHEDULE: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Schedule' },
  { key: 'show_descriptions', label: 'Show Session Descriptions', type: 'toggle' },
  { key: 'group_by_stage', label: 'Group by Stage', type: 'toggle' },
];

const EVENT_SPEAKERS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Speakers' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
  { key: 'show_bio', label: 'Show Bio', type: 'toggle' },
];

const EVENT_LOCATION: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Location' },
  { key: 'venue_name', label: 'Venue Name', type: 'text', placeholder: 'Convention Center' },
  { key: 'address', label: 'Address', type: 'text', placeholder: '123 Main St' },
  { key: 'city', label: 'City', type: 'text', placeholder: 'San Francisco, CA' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Venue details' },
  { key: 'map_embed_url', label: 'Map Embed URL', type: 'url', placeholder: 'https://maps.google.com/...', group: 'Map' },
  { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
];

const EVENT_SPONSORS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Sponsors' },
  { key: 'show_tier_labels', label: 'Show Tier Labels', type: 'toggle' },
];

const EVENT_FAQ: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'FAQ' },
  { key: 'allow_multiple_open', label: 'Allow Multiple Open', type: 'toggle' },
];

const EVENT_GALLERY: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Gallery' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
  { key: 'aspect_ratio', label: 'Aspect Ratio', type: 'select', options: [
    { value: 'auto', label: 'Auto' },
    { value: '1/1', label: 'Square' },
    { value: '4/3', label: '4:3' },
    { value: '16/9', label: '16:9' },
  ]},
];

const EVENT_COLLECTIBLES: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Collectibles' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
];

const EVENT_COUNTDOWN: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Event Starts In' },
  { key: 'target_date', label: 'Target Date', type: 'text', placeholder: '2026-04-01T18:00:00Z' },
  { key: 'expired_text', label: 'Expired Text', type: 'text', placeholder: 'Event has started!' },
  { key: 'show_days', label: 'Show Days', type: 'toggle', group: 'Visible Units' },
  { key: 'show_hours', label: 'Show Hours', type: 'toggle' },
  { key: 'show_minutes', label: 'Show Minutes', type: 'toggle' },
  { key: 'show_seconds', label: 'Show Seconds', type: 'toggle' },
];

// ── Space Section Fields ──

const SPACE_HERO: FieldDef[] = [
  { key: 'name', label: 'Space Name', type: 'text', placeholder: 'Community name' },
  { key: 'tagline', label: 'Tagline', type: 'textarea', placeholder: 'Short tagline' },
  { key: 'avatar_url', label: 'Avatar URL', type: 'url', placeholder: 'https://...' },
  { key: 'cover_image_url', label: 'Cover Image URL', type: 'url', placeholder: 'https://...' },
  { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Join Space', group: 'Call to Action' },
  { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: 'https://...' },
  { key: 'member_count', label: 'Member Count', type: 'number', min: 0 },
  { key: 'show_member_count', label: 'Show Member Count', type: 'toggle' },
];

const SPACE_EVENTS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Upcoming Events' },
  { key: 'layout_style', label: 'Layout', type: 'select', options: [
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
  ]},
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
  { key: 'show_past_events', label: 'Show Past Events', type: 'toggle' },
];

const SPACE_MEMBERS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Members' },
  { key: 'max_display', label: 'Max Display', type: 'number', min: 1, max: 100 },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
  { key: 'show_roles', label: 'Show Roles', type: 'toggle' },
];

const SPACE_FEED: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Latest Updates' },
  { key: 'max_display', label: 'Max Posts', type: 'number', min: 1, max: 50 },
];

const SPACE_ABOUT: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'About' },
  { key: 'description', label: 'Description (HTML)', type: 'textarea', placeholder: 'About this community...' },
  { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Image' },
  { key: 'image_position', label: 'Image Position', type: 'select', options: [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ]},
  { key: 'show_image', label: 'Show Image', type: 'toggle' },
];

const SPACE_LAUNCHPAD: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Launchpad' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
];

const SPACE_COIN: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Community Token' },
  { key: 'coin_name', label: 'Coin Name', type: 'text', placeholder: 'Lemonade Coin', group: 'Token Info' },
  { key: 'coin_symbol', label: 'Symbol', type: 'text', placeholder: 'LMN' },
  { key: 'coin_image_url', label: 'Coin Image URL', type: 'url', placeholder: 'https://...' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'price', label: 'Price', type: 'text', placeholder: '$0.042', group: 'Market Data' },
  { key: 'price_change_24h', label: 'Price Change (24h %)', type: 'number' },
  { key: 'market_cap', label: 'Market Cap', type: 'text', placeholder: '$4.2M' },
  { key: 'holders', label: 'Holders', type: 'number', min: 0 },
  { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Buy Token', group: 'Call to Action' },
  { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: 'https://...' },
];

const SPACE_COLLECTIBLES: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Collectibles' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
];

const SPACE_HUBS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Hubs' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
];

// ── Universal Section Fields ──

const RICH_TEXT: FieldDef[] = [
  { key: 'content', label: 'Content (HTML)', type: 'textarea', placeholder: '<p>Your content here...</p>' },
];

const IMAGE_BANNER: FieldDef[] = [
  { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
  { key: 'title', label: 'Overlay Title', type: 'text', placeholder: 'Banner title' },
  { key: 'subtitle', label: 'Overlay Subtitle', type: 'textarea', placeholder: 'Banner subtitle' },
  { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Learn More', group: 'Call to Action' },
  { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: 'https://...' },
  { key: 'overlay_opacity', label: 'Overlay Opacity (%)', type: 'number', min: 0, max: 100, group: 'Appearance' },
  { key: 'aspect_ratio', label: 'Aspect Ratio', type: 'select', options: [
    { value: '16/9', label: '16:9' },
    { value: '21/9', label: '21:9' },
    { value: '4/3', label: '4:3' },
    { value: 'auto', label: 'Auto' },
  ]},
];

const VIDEO_EMBED: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Video' },
  { key: 'video_url', label: 'Video URL', type: 'url', placeholder: 'https://youtube.com/...' },
  { key: 'aspect_ratio', label: 'Aspect Ratio', type: 'select', options: [
    { value: '16/9', label: '16:9' },
    { value: '4/3', label: '4:3' },
    { value: '1/1', label: 'Square' },
  ]},
  { key: 'autoplay', label: 'Autoplay', type: 'toggle' },
  { key: 'muted', label: 'Muted', type: 'toggle' },
];

const CTA_BLOCK: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Ready to get started?' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Supporting text' },
  { key: 'primary_cta_text', label: 'Primary CTA Text', type: 'text', placeholder: 'Get Started', group: 'Primary CTA' },
  { key: 'primary_cta_url', label: 'Primary CTA URL', type: 'url', placeholder: 'https://...' },
  { key: 'secondary_cta_text', label: 'Secondary CTA Text', type: 'text', placeholder: '', group: 'Secondary CTA' },
  { key: 'secondary_cta_url', label: 'Secondary CTA URL', type: 'url', placeholder: 'https://...' },
  { key: 'accent_color', label: 'Accent Color', type: 'color' },
];

const CARDS_GRID: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Cards' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
];

const TESTIMONIALS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'What People Say' },
  { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
];

const SOCIAL_LINKS: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Follow Us' },
  { key: 'icon_size', label: 'Icon Size', type: 'select', options: [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ]},
  { key: 'style', label: 'Style', type: 'select', options: [
    { value: 'icons-only', label: 'Icons Only' },
    { value: 'icons-labels', label: 'Icons + Labels' },
    { value: 'buttons', label: 'Buttons' },
  ]},
];

const CUSTOM_HTML: FieldDef[] = [
  { key: 'html_content', label: 'HTML', type: 'textarea', placeholder: '<div>Your HTML...</div>' },
  { key: 'css_content', label: 'CSS', type: 'textarea', placeholder: '.my-class { color: white; }' },
];

const SPACER: FieldDef[] = [
  { key: 'height', label: 'Height', type: 'select', options: [
    { value: 'xs', label: 'Extra Small (16px)' },
    { value: 'sm', label: 'Small (32px)' },
    { value: 'md', label: 'Medium (48px)' },
    { value: 'lg', label: 'Large (64px)' },
    { value: 'xl', label: 'Extra Large (96px)' },
    { value: '2xl', label: '2XL (128px)' },
  ]},
  { key: 'show_divider', label: 'Show Divider', type: 'toggle' },
  { key: 'divider_style', label: 'Divider Style', type: 'select', options: [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
  ]},
];

const HEADER: FieldDef[] = [
  { key: 'logo_url', label: 'Logo URL', type: 'url', placeholder: 'https://...' },
  { key: 'logo_text', label: 'Logo Text', type: 'text', placeholder: 'Brand Name' },
  { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Sign Up', group: 'Call to Action' },
  { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: 'https://...' },
  { key: 'is_sticky', label: 'Sticky Header', type: 'toggle', group: 'Behavior' },
  { key: 'is_transparent', label: 'Transparent Background', type: 'toggle' },
];

const FOOTER: FieldDef[] = [
  { key: 'logo_url', label: 'Logo URL', type: 'url', placeholder: 'https://...' },
  { key: 'logo_text', label: 'Logo Text', type: 'text', placeholder: 'Brand Name' },
  { key: 'copyright_text', label: 'Copyright Text', type: 'text', placeholder: '© 2026 Company' },
  { key: 'show_powered_by', label: 'Show "Powered by Lemonade"', type: 'toggle' },
];

const MUSIC_PLAYER: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Now Playing' },
  { key: 'embed_type', label: 'Embed Type', type: 'select', options: [
    { value: 'custom', label: 'Custom' },
    { value: 'spotify', label: 'Spotify' },
    { value: 'soundcloud', label: 'SoundCloud' },
  ]},
  { key: 'track_url', label: 'Track/Embed URL', type: 'url', placeholder: 'https://...' },
  { key: 'track_title', label: 'Track Title', type: 'text', placeholder: 'Song title', group: 'Track Info' },
  { key: 'artist_name', label: 'Artist', type: 'text', placeholder: 'Artist name' },
  { key: 'cover_image_url', label: 'Cover Image URL', type: 'url', placeholder: 'https://...' },
];

const WALLET_CONNECT: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Connect Wallet' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Connect Wallet' },
  { key: 'show_wallet_icons', label: 'Show Wallet Icons', type: 'toggle' },
];

const PASSPORT: FieldDef[] = [
  { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Event Passport' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'badge_image_url', label: 'Badge Image URL', type: 'url', placeholder: 'https://...', group: 'Badge' },
  { key: 'badge_name', label: 'Badge Name', type: 'text', placeholder: 'VIP Badge' },
  { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Claim Passport', group: 'Call to Action' },
  { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: 'https://...' },
];

// ── Container Section Fields ──

const COLUMNS: FieldDef[] = [
  { key: 'columns_count', label: 'Number of Columns', type: 'number', min: 2, max: 4 },
  { key: 'gap', label: 'Gap', type: 'select', options: [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ]},
  { key: 'column_widths', label: 'Custom Widths (CSS)', type: 'text', placeholder: 'e.g. 1fr 2fr 1fr' },
];

const TABS: FieldDef[] = [
  { key: 'active_tab', label: 'Default Active Tab', type: 'number', min: 0 },
];

const ACCORDION: FieldDef[] = [
  { key: 'allow_multiple_open', label: 'Allow Multiple Open', type: 'toggle' },
];

// ── Registry ──

export const FIELD_REGISTRY: Partial<Record<SectionType, FieldDef[]>> = {
  // Event
  event_hero: EVENT_HERO,
  event_registration: EVENT_REGISTRATION,
  event_about: EVENT_ABOUT,
  event_schedule: EVENT_SCHEDULE,
  event_speakers: EVENT_SPEAKERS,
  event_location: EVENT_LOCATION,
  event_sponsors: EVENT_SPONSORS,
  event_faq: EVENT_FAQ,
  event_gallery: EVENT_GALLERY,
  event_collectibles: EVENT_COLLECTIBLES,
  event_countdown: EVENT_COUNTDOWN,
  // Space
  space_hero: SPACE_HERO,
  space_events: SPACE_EVENTS,
  space_members: SPACE_MEMBERS,
  space_feed: SPACE_FEED,
  space_about: SPACE_ABOUT,
  space_launchpad: SPACE_LAUNCHPAD,
  space_coin: SPACE_COIN,
  space_collectibles: SPACE_COLLECTIBLES,
  space_hubs: SPACE_HUBS,
  // Universal
  rich_text: RICH_TEXT,
  image_banner: IMAGE_BANNER,
  video_embed: VIDEO_EMBED,
  cta_block: CTA_BLOCK,
  cards_grid: CARDS_GRID,
  testimonials: TESTIMONIALS,
  social_links: SOCIAL_LINKS,
  custom_html: CUSTOM_HTML,
  spacer: SPACER,
  header: HEADER,
  footer: FOOTER,
  music_player: MUSIC_PLAYER,
  wallet_connect: WALLET_CONNECT,
  passport: PASSPORT,
  // Containers
  columns: COLUMNS,
  tabs: TABS,
  accordion: ACCORDION,
};
