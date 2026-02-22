/**
 * Section Resolver — maps component names to their React implementations.
 *
 * Craft.js uses this map to (de)serialise its node tree.
 * All section components are fully implemented.
 */

import React from 'react';
import type { SectionType } from '../types';

// Event sections
import { EventHero } from './event/EventHero';
import { EventRegistration } from './event/EventRegistration';
import { EventAbout } from './event/EventAbout';
import { EventSchedule } from './event/EventSchedule';
import { EventSpeakers } from './event/EventSpeakers';
import { EventLocation } from './event/EventLocation';
import { EventSponsors } from './event/EventSponsors';
import { EventFAQ } from './event/EventFAQ';
import { EventGallery } from './event/EventGallery';
import { EventCollectibles } from './event/EventCollectibles';
import { EventCountdown } from './event/EventCountdown';

// Space sections
import { SpaceHero } from './space/SpaceHero';
import { SpaceEvents } from './space/SpaceEvents';
import { SpaceMembers } from './space/SpaceMembers';
import { SpaceFeed } from './space/SpaceFeed';
import { SpaceAbout } from './space/SpaceAbout';
import { SpaceLaunchpad } from './space/SpaceLaunchpad';
import { SpaceCoin } from './space/SpaceCoin';
import { SpaceCollectibles } from './space/SpaceCollectibles';
import { SpaceHubs } from './space/SpaceHubs';

// Universal sections
import { RichText } from './universal/RichText';
import { ImageBanner } from './universal/ImageBanner';
import { VideoEmbed } from './universal/VideoEmbed';
import { CTABlock } from './universal/CTABlock';
import { CardsGrid } from './universal/CardsGrid';
import { Testimonials } from './universal/Testimonials';
import { SocialLinks } from './universal/SocialLinks';
import { CustomHTML } from './universal/CustomHTML';
import { Spacer } from './universal/Spacer';
import { Header } from './universal/Header';
import { Footer } from './universal/Footer';
import { MusicPlayer } from './universal/MusicPlayer';
import { WalletConnect } from './universal/WalletConnect';
import { Passport } from './universal/Passport';

// Container sections + their canvas sub-components
import { Columns, ColumnCanvas } from './containers/Columns';
import { Tabs, TabCanvas } from './containers/Tabs';
import { AccordionContainer, AccordionPanelCanvas } from './containers/Accordion';

// Display labels for every section type
const SECTION_LABELS: Record<SectionType, string> = {
  // Event-specific
  event_hero: 'Event Hero',
  event_registration: 'Event Registration',
  event_about: 'Event About',
  event_schedule: 'Event Schedule',
  event_speakers: 'Event Speakers',
  event_location: 'Event Location',
  event_sponsors: 'Event Sponsors',
  event_faq: 'Event FAQ',
  event_gallery: 'Event Gallery',
  event_collectibles: 'Event Collectibles',
  event_countdown: 'Event Countdown',
  // Space-specific
  space_hero: 'Space Hero',
  space_events: 'Space Events',
  space_members: 'Space Members',
  space_feed: 'Space Feed',
  space_about: 'Space About',
  space_launchpad: 'Space Launchpad',
  space_coin: 'Space Coin',
  space_collectibles: 'Space Collectibles',
  space_hubs: 'Space Hubs',
  // Universal
  rich_text: 'Rich Text',
  image_banner: 'Image Banner',
  video_embed: 'Video Embed',
  cta_block: 'CTA Block',
  cards_grid: 'Cards Grid',
  testimonials: 'Testimonials',
  social_links: 'Social Links',
  custom_html: 'Custom HTML',
  spacer: 'Spacer',
  header: 'Header',
  footer: 'Footer',
  music_player: 'Music Player',
  wallet_connect: 'Wallet Connect',
  passport: 'Passport',
  // Containers
  columns: 'Columns',
  tabs: 'Tabs',
  accordion: 'Accordion',
};

/**
 * The main resolver map keyed by PascalCase component name.
 * Craft.js uses these keys for serialisation / deserialisation.
 * Canvas sub-components (ColumnCanvas, TabCanvas, AccordionPanelCanvas)
 * must also be included so nested drop zones resolve correctly.
 */
export const sectionResolver: Record<string, React.ComponentType<any>> = {
  // Event sections
  EventHero,
  EventRegistration,
  EventAbout,
  EventSchedule,
  EventSpeakers,
  EventLocation,
  EventSponsors,
  EventFAQ,
  EventGallery,
  EventCollectibles,
  EventCountdown,

  // Space sections
  SpaceHero,
  SpaceEvents,
  SpaceMembers,
  SpaceFeed,
  SpaceAbout,
  SpaceLaunchpad,
  SpaceCoin,
  SpaceCollectibles,
  SpaceHubs,

  // Universal sections
  RichText,
  ImageBanner,
  VideoEmbed,
  CTABlock,
  CardsGrid,
  Testimonials,
  SocialLinks,
  CustomHTML,
  Spacer,
  Header,
  Footer,
  MusicPlayer,
  WalletConnect,
  Passport,

  // Container sections
  Columns,
  ColumnCanvas,
  Tabs,
  TabCanvas,
  AccordionContainer,
  AccordionPanelCanvas,
};

/** Helper to look up the display label for a section type */
export function getSectionLabel(type: SectionType): string {
  return SECTION_LABELS[type] ?? type;
}

/** Convert snake_case section type to PascalCase component name */
function toPascalCase(snakeStr: string): string {
  return snakeStr
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

/** Map SectionType enum values (snake_case) to PascalCase component names */
export const sectionTypeToComponent: Record<SectionType, string> = Object.keys(
  SECTION_LABELS,
).reduce(
  (acc, key) => {
    const sectionType = key as SectionType;
    // Special case: accordion maps to AccordionContainer
    acc[sectionType] =
      sectionType === 'accordion' ? 'AccordionContainer' : toPascalCase(key);
    return acc;
  },
  {} as Record<SectionType, string>,
);

/** Reverse-lookup: PascalCase name -> SectionType */
export const PASCAL_TO_SECTION_TYPE: Record<string, SectionType> = Object.keys(
  SECTION_LABELS,
).reduce(
  (acc, key) => {
    const sectionType = key as SectionType;
    const pascal =
      sectionType === 'accordion' ? 'AccordionContainer' : toPascalCase(key);
    acc[pascal] = sectionType;
    return acc;
  },
  {} as Record<string, SectionType>,
);
