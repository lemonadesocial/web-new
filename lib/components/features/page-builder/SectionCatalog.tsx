'use client';

import React from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';

import { Button } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { Pane } from '$lib/components/core/pane/pane';
import { drawer } from '$lib/components/core/dialog';

import { ownerTypeAtom } from './store';
import type {
  SectionCategory,
  SectionCatalogItem,
  SectionType,
  SubscriptionTier,
} from './types';
import { BASIC_SECTIONS, ALL_SECTIONS, CONTAINER_SECTIONS, CUSTOM_CODE_SECTIONS } from './types';

// --- Section Catalog Data ---

const SECTION_CATALOG: SectionCatalogItem[] = [
  // Event sections
  { type: 'event_hero', name: 'Hero', description: 'Main hero banner with event title and CTA', category: 'event', tier_required: 'free' },
  { type: 'event_registration', name: 'Registration', description: 'Ticket types and registration form', category: 'event', tier_required: 'free' },
  { type: 'event_about', name: 'About', description: 'Event description and details', category: 'event', tier_required: 'free' },
  { type: 'event_schedule', name: 'Schedule', description: 'Timeline of sessions and talks', category: 'event', tier_required: 'pro' },
  { type: 'event_speakers', name: 'Speakers', description: 'Speaker cards with bios and socials', category: 'event', tier_required: 'pro' },
  { type: 'event_location', name: 'Location', description: 'Venue map and address', category: 'event', tier_required: 'free' },
  { type: 'event_sponsors', name: 'Sponsors', description: 'Sponsor logos by tier', category: 'event', tier_required: 'pro' },
  { type: 'event_faq', name: 'FAQ', description: 'Frequently asked questions accordion', category: 'event', tier_required: 'pro' },
  { type: 'event_gallery', name: 'Gallery', description: 'Photo gallery or media carousel', category: 'event', tier_required: 'pro' },
  { type: 'event_collectibles', name: 'Collectibles', description: 'NFT collectibles showcase', category: 'event', tier_required: 'pro' },
  { type: 'event_countdown', name: 'Countdown', description: 'Countdown timer to event start', category: 'event', tier_required: 'pro' },

  // Space sections
  { type: 'space_hero', name: 'Hero', description: 'Community hero banner', category: 'space', tier_required: 'free' },
  { type: 'space_events', name: 'Events', description: 'Upcoming events listing', category: 'space', tier_required: 'free' },
  { type: 'space_members', name: 'Members', description: 'Member grid or list', category: 'space', tier_required: 'pro' },
  { type: 'space_feed', name: 'Feed', description: 'Community activity feed', category: 'space', tier_required: 'pro' },
  { type: 'space_about', name: 'About', description: 'Community description and links', category: 'space', tier_required: 'free' },
  { type: 'space_launchpad', name: 'Launchpad', description: 'Token and NFT launchpad', category: 'space', tier_required: 'pro' },
  { type: 'space_coin', name: 'Coin', description: 'Community coin dashboard', category: 'space', tier_required: 'pro' },
  { type: 'space_collectibles', name: 'Collectibles', description: 'NFT collectibles showcase', category: 'space', tier_required: 'pro' },
  { type: 'space_hubs', name: 'Hubs', description: 'Sub-community hubs directory', category: 'space', tier_required: 'pro' },

  // Universal sections
  { type: 'rich_text', name: 'Rich Text', description: 'Formatted text block with headings', category: 'universal', tier_required: 'free' },
  { type: 'image_banner', name: 'Image Banner', description: 'Full-width image with optional overlay', category: 'universal', tier_required: 'free' },
  { type: 'video_embed', name: 'Video', description: 'Embed YouTube, Vimeo, or custom video', category: 'universal', tier_required: 'pro' },
  { type: 'cta_block', name: 'CTA Block', description: 'Call-to-action with button', category: 'universal', tier_required: 'free' },
  { type: 'cards_grid', name: 'Cards Grid', description: 'Grid of info or feature cards', category: 'universal', tier_required: 'pro' },
  { type: 'testimonials', name: 'Testimonials', description: 'Quotes and social proof', category: 'universal', tier_required: 'pro' },
  { type: 'social_links', name: 'Social Links', description: 'Social media icon links', category: 'universal', tier_required: 'pro' },
  { type: 'custom_html', name: 'Custom HTML', description: 'Raw HTML/CSS embed', category: 'universal', tier_required: 'enterprise' },
  { type: 'spacer', name: 'Spacer', description: 'Vertical spacing element', category: 'universal', tier_required: 'free' },
  { type: 'header', name: 'Header', description: 'Navigation header bar', category: 'universal', tier_required: 'pro' },
  { type: 'footer', name: 'Footer', description: 'Footer with links and credits', category: 'universal', tier_required: 'pro' },
  { type: 'music_player', name: 'Music Player', description: 'Background music controller', category: 'universal', tier_required: 'pro' },
  { type: 'wallet_connect', name: 'Wallet Connect', description: 'Web3 wallet connection prompt', category: 'universal', tier_required: 'pro' },
  { type: 'passport', name: 'Passport', description: 'NFT passport claim section', category: 'universal', tier_required: 'pro' },

  // Container sections
  { type: 'columns', name: 'Columns', description: 'Multi-column layout container', category: 'container', tier_required: 'pro' },
  { type: 'tabs', name: 'Tabs', description: 'Tabbed content container', category: 'container', tier_required: 'pro' },
  { type: 'accordion', name: 'Accordion', description: 'Collapsible content container', category: 'container', tier_required: 'pro' },
];

// --- Category metadata ---

const CATEGORY_META: Record<SectionCategory, { label: string; icon: string }> = {
  event: { label: 'Event Sections', icon: 'icon-ticket' },
  space: { label: 'Space Sections', icon: 'icon-community' },
  universal: { label: 'Universal Sections', icon: 'icon-grid-view' },
  container: { label: 'Containers', icon: 'icon-dashboard' },
};

// --- Tier ordering for lock check ---

const TIER_ORDER: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  plus: 2,
  max: 3,
  enterprise: 4,
};

/**
 * SectionCatalog — rendered inside a right drawer when the "Sections"
 * toolbar icon is clicked.
 *
 * Sections are grouped by category and filtered by search text.
 * Items display name, description, and a lock icon if the user's
 * subscription tier is too low.
 *
 * When Craft.js is integrated, each item will become a drag source
 * using `useEditor().connectors.create`.
 */
export function SectionCatalog() {
  const ownerType = useAtomValue(ownerTypeAtom);
  const [search, setSearch] = React.useState('');

  // TODO: Derive from actual subscription data
  const userTier: SubscriptionTier = 'free';

  // Filter sections relevant to the current owner type
  const relevantCategories: SectionCategory[] =
    ownerType === 'event'
      ? ['event', 'universal', 'container']
      : ['space', 'universal', 'container'];

  const filteredSections = SECTION_CATALOG.filter((item) => {
    if (!relevantCategories.includes(item.category)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  const grouped = relevantCategories
    .map((cat) => ({
      category: cat,
      ...CATEGORY_META[cat],
      items: filteredSections.filter((s) => s.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Pane.Root className="rounded-none">
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton={false}>
          <span className="text-sm font-semibold text-primary">Sections</span>
        </Pane.Header.Left>
        <Pane.Header.Right>
          <Button
            icon="icon-x"
            variant="flat"
            size="xs"
            onClick={() => drawer.close()}
          />
        </Pane.Header.Right>
      </Pane.Header.Root>
      <Pane.Content className="p-4 space-y-4 overflow-auto">
        {/* Search */}
        <InputField
          iconLeft="icon-search"
          placeholder="Search sections..."
          value={search}
          onChangeText={setSearch}
        />

        {/* Grouped sections */}
        {grouped.map((group) => (
          <div key={group.category} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <i className={clsx(group.icon, 'size-4 text-tertiary')} />
              <span className="text-xs font-semibold text-tertiary uppercase tracking-wide">
                {group.label}
              </span>
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isLocked = TIER_ORDER[item.tier_required] > TIER_ORDER[userTier];
                return (
                  <SectionCatalogRow
                    key={item.type}
                    item={item}
                    isLocked={isLocked}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-tertiary">No sections match your search.</p>
          </div>
        )}
      </Pane.Content>
    </Pane.Root>
  );
}

// --- Section row ---

function SectionCatalogRow({
  item,
  isLocked,
}: {
  item: SectionCatalogItem;
  isLocked: boolean;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    // Craft.js drag-and-drop will be wired here.
    // For now, encode the section type in dataTransfer for future integration.
    e.dataTransfer.setData('application/x-section-type', item.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      draggable={!isLocked}
      onDragStart={handleDragStart}
      className={clsx(
        'flex items-center gap-3 px-3 py-2.5 rounded-sm border border-transparent transition',
        isLocked
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-grab hover:bg-primary/4 hover:border-card-border active:cursor-grabbing',
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary truncate">{item.name}</p>
        <p className="text-xs text-tertiary truncate">{item.description}</p>
      </div>
      {isLocked ? (
        <i className="icon-lock size-4 text-tertiary shrink-0" title="Upgrade to unlock" />
      ) : (
        <i className="icon-drag-indicator size-4 text-quaternary shrink-0" />
      )}
    </div>
  );
}
