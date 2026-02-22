/**
 * Runtime Resolver — maps SectionType (snake_case) to React components for SSR.
 *
 * Unlike the Craft.js resolver (PascalCase keys for serialisation), this map
 * uses the SectionType enum values directly so ConfigRuntime can look up
 * components without any string conversion.
 *
 * Section components are 'use client' — that is fine because Next.js server
 * components can render client components as leaves in the tree.
 */

import type React from 'react';
import type { SectionType } from './types';

// Event sections
import { EventHero } from './sections/event/EventHero';
import { EventRegistration } from './sections/event/EventRegistration';
import { EventAbout } from './sections/event/EventAbout';
import { EventSchedule } from './sections/event/EventSchedule';
import { EventSpeakers } from './sections/event/EventSpeakers';
import { EventLocation } from './sections/event/EventLocation';
import { EventSponsors } from './sections/event/EventSponsors';
import { EventFAQ } from './sections/event/EventFAQ';
import { EventGallery } from './sections/event/EventGallery';
import { EventCollectibles } from './sections/event/EventCollectibles';
import { EventCountdown } from './sections/event/EventCountdown';

// Space sections
import { SpaceHero } from './sections/space/SpaceHero';
import { SpaceEvents } from './sections/space/SpaceEvents';
import { SpaceMembers } from './sections/space/SpaceMembers';
import { SpaceFeed } from './sections/space/SpaceFeed';
import { SpaceAbout } from './sections/space/SpaceAbout';
import { SpaceLaunchpad } from './sections/space/SpaceLaunchpad';
import { SpaceCoin } from './sections/space/SpaceCoin';
import { SpaceCollectibles } from './sections/space/SpaceCollectibles';
import { SpaceHubs } from './sections/space/SpaceHubs';

// Universal sections
import { RichText } from './sections/universal/RichText';
import { ImageBanner } from './sections/universal/ImageBanner';
import { VideoEmbed } from './sections/universal/VideoEmbed';
import { CTABlock } from './sections/universal/CTABlock';
import { CardsGrid } from './sections/universal/CardsGrid';
import { Testimonials } from './sections/universal/Testimonials';
import { SocialLinks } from './sections/universal/SocialLinks';
import { CustomHTML } from './sections/universal/CustomHTML';
import { Spacer } from './sections/universal/Spacer';
import { Header } from './sections/universal/Header';
import { Footer } from './sections/universal/Footer';
import { MusicPlayer } from './sections/universal/MusicPlayer';
import { WalletConnect } from './sections/universal/WalletConnect';
import { Passport } from './sections/universal/Passport';

// Container sections (primary component only — canvas sub-components are
// Craft.js-specific and not needed in the SSR runtime)
import { Columns } from './sections/containers/Columns';
import { Tabs } from './sections/containers/Tabs';
import { AccordionContainer } from './sections/containers/Accordion';

/**
 * Maps every SectionType value to its React component.
 *
 * The `Record<SectionType, …>` type ensures this map stays exhaustive — adding
 * a new SectionType to the union will cause a compile error here until a
 * matching component entry is added.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const runtimeResolver: Record<SectionType, React.ComponentType<any>> = {
  // Event sections
  event_hero: EventHero,
  event_registration: EventRegistration,
  event_about: EventAbout,
  event_schedule: EventSchedule,
  event_speakers: EventSpeakers,
  event_location: EventLocation,
  event_sponsors: EventSponsors,
  event_faq: EventFAQ,
  event_gallery: EventGallery,
  event_collectibles: EventCollectibles,
  event_countdown: EventCountdown,

  // Space sections
  space_hero: SpaceHero,
  space_events: SpaceEvents,
  space_members: SpaceMembers,
  space_feed: SpaceFeed,
  space_about: SpaceAbout,
  space_launchpad: SpaceLaunchpad,
  space_coin: SpaceCoin,
  space_collectibles: SpaceCollectibles,
  space_hubs: SpaceHubs,

  // Universal sections
  rich_text: RichText,
  image_banner: ImageBanner,
  video_embed: VideoEmbed,
  cta_block: CTABlock,
  cards_grid: CardsGrid,
  testimonials: Testimonials,
  social_links: SocialLinks,
  custom_html: CustomHTML,
  spacer: Spacer,
  header: Header,
  footer: Footer,
  music_player: MusicPlayer,
  wallet_connect: WalletConnect,
  passport: Passport,

  // Container sections
  columns: Columns,
  tabs: Tabs,
  accordion: AccordionContainer,
};
