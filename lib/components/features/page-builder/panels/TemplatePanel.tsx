'use client';

import React from 'react';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';

import { Button, Skeleton, Badge } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';

import { pageConfigAtom, isDirtyAtom, ownerTypeAtom } from '../store';
import type { Template, TemplateCategory, TemplateTarget } from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  'all',
  'conference',
  'festival',
  'meetup',
  'workshop',
  'concert',
  'networking',
  'community',
  'minimal',
  'premium',
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  conference: '#6366f1',
  festival: '#f43f5e',
  meetup: '#10b981',
  workshop: '#f59e0b',
  concert: '#ec4899',
  networking: '#8b5cf6',
  community: '#06b6d4',
  minimal: '#64748b',
  premium: '#d97706',
  custom: '#a3a3a3',
  dao: '#3b82f6',
  brand: '#14b8a6',
  portfolio: '#e879f9',
};

// ---------------------------------------------------------------------------
// Mock Data (TODO: Replace with LIST_TEMPLATES query)
// ---------------------------------------------------------------------------

const MOCK_TEMPLATES: Template[] = [
  {
    _id: 'tpl_001',
    name: 'Tech Conference',
    slug: 'tech-conference',
    description: 'A bold, professional layout for multi-day tech conferences with speaker grids and schedule.',
    category: 'conference',
    tags: ['tech', 'speakers', 'schedule'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'free',
    marketplace_listed: true,
    install_count: 1240,
    rating_average: 4.8,
    rating_count: 156,
    version: '2.1.0',
    created_at: '2025-06-01T00:00:00Z',
    updated_at: '2025-12-15T00:00:00Z',
  },
  {
    _id: 'tpl_002',
    name: 'Music Festival',
    slug: 'music-festival',
    description: 'Vibrant, immersive template with hero video and lineup sections for music festivals.',
    category: 'festival',
    tags: ['music', 'lineup', 'vibrant'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'pro',
    marketplace_listed: true,
    install_count: 890,
    rating_average: 4.6,
    rating_count: 98,
    version: '1.4.0',
    created_at: '2025-07-10T00:00:00Z',
    updated_at: '2025-11-20T00:00:00Z',
  },
  {
    _id: 'tpl_003',
    name: 'Workshop Series',
    slug: 'workshop-series',
    description: 'Clean, minimal template for hands-on workshops with registration focus.',
    category: 'workshop',
    tags: ['workshop', 'clean', 'registration'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    creator_type: 'designer',
    creator_id: 'designer_01',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'free',
    marketplace_listed: true,
    install_count: 2100,
    rating_average: 4.9,
    rating_count: 312,
    version: '3.0.1',
    created_at: '2025-04-15T00:00:00Z',
    updated_at: '2026-01-05T00:00:00Z',
  },
  {
    _id: 'tpl_004',
    name: 'Evening Concert',
    slug: 'evening-concert',
    description: 'Dark-themed, atmospheric template for concert and live music events.',
    category: 'concert',
    tags: ['concert', 'dark', 'music'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'pro',
    marketplace_listed: true,
    install_count: 560,
    rating_average: 4.5,
    rating_count: 67,
    version: '1.2.0',
    created_at: '2025-08-20T00:00:00Z',
    updated_at: '2025-12-01T00:00:00Z',
  },
  {
    _id: 'tpl_005',
    name: 'Casual Meetup',
    slug: 'casual-meetup',
    description: 'Friendly, approachable layout for local meetups and community gatherings.',
    category: 'meetup',
    tags: ['meetup', 'casual', 'community'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    creator_type: 'community',
    creator_id: 'community_01',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'free',
    marketplace_listed: true,
    install_count: 3400,
    rating_average: 4.7,
    rating_count: 421,
    version: '2.0.0',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-10-15T00:00:00Z',
  },
  {
    _id: 'tpl_006',
    name: 'Networking Mixer',
    slug: 'networking-mixer',
    description: 'Professional networking template with attendee profiles and agenda.',
    category: 'networking',
    tags: ['networking', 'professional', 'agenda'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'pro',
    marketplace_listed: true,
    install_count: 780,
    rating_average: 4.4,
    rating_count: 89,
    version: '1.1.0',
    created_at: '2025-09-01T00:00:00Z',
    updated_at: '2025-12-20T00:00:00Z',
  },
  {
    _id: 'tpl_007',
    name: 'Community Hub',
    slug: 'community-hub',
    description: 'Feature-rich community space template with events, members, and feed.',
    category: 'community',
    tags: ['community', 'hub', 'space'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'space',
    visibility: 'public',
    subscription_tier_min: 'free',
    marketplace_listed: true,
    install_count: 1650,
    rating_average: 4.7,
    rating_count: 203,
    version: '2.3.0',
    created_at: '2025-05-10T00:00:00Z',
    updated_at: '2026-01-10T00:00:00Z',
  },
  {
    _id: 'tpl_008',
    name: 'Minimal Event',
    slug: 'minimal-event',
    description: 'Ultra-clean, distraction-free template with elegant typography.',
    category: 'minimal',
    tags: ['minimal', 'clean', 'typography'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'universal',
    visibility: 'public',
    subscription_tier_min: 'free',
    marketplace_listed: true,
    install_count: 4200,
    rating_average: 4.9,
    rating_count: 578,
    version: '3.1.0',
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  },
  {
    _id: 'tpl_009',
    name: 'Premium Showcase',
    slug: 'premium-showcase',
    description: 'Premium template with parallax effects, video backgrounds, and animations.',
    category: 'premium',
    tags: ['premium', 'parallax', 'animated'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1634017839464-5c339afa413d?w=600&h=400&fit=crop',
    creator_type: 'designer',
    creator_id: 'designer_02',
    target: 'universal',
    visibility: 'public',
    subscription_tier_min: 'plus',
    marketplace_listed: true,
    price_cents: 2999,
    currency: 'USD',
    install_count: 320,
    rating_average: 4.8,
    rating_count: 45,
    version: '1.0.2',
    created_at: '2025-11-01T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
  },
  {
    _id: 'tpl_010',
    name: 'Web3 Conference',
    slug: 'web3-conference',
    description: 'Blockchain-themed conference template with wallet connect and NFT sections.',
    category: 'conference',
    tags: ['web3', 'blockchain', 'nft'],
    config: {} as Template['config'],
    thumbnail_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop',
    creator_type: 'platform',
    creator_id: 'lemonade',
    target: 'event',
    visibility: 'public',
    subscription_tier_min: 'pro',
    marketplace_listed: true,
    install_count: 410,
    rating_average: 4.3,
    rating_count: 52,
    version: '1.3.0',
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2025-12-28T00:00:00Z',
  },
];

import { formatInstallCount, renderStars } from '../utils';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TemplateCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton animate className="aspect-[3/2] w-full rounded-sm" />
      <Skeleton animate className="h-4 w-3/4 rounded-full" />
      <Skeleton animate className="h-3 w-1/2 rounded-full" />
      <Skeleton animate className="h-7 w-24 rounded-sm" />
    </div>
  );
}

function TemplateCard({
  template,
  onApply,
  isApplying,
}: {
  template: Template;
  onApply: (template: Template) => void;
  isApplying: boolean;
}) {
  const badgeColor = CATEGORY_COLORS[template.category] ?? '#a3a3a3';

  return (
    <div className="flex flex-col gap-2 group">
      {/* Thumbnail */}
      <div className="relative aspect-[3/2] rounded-sm overflow-hidden bg-primary/4">
        <img
          src={template.thumbnail_url}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {template.price_cents != null && template.price_cents > 0 && (
          <div className="absolute top-1.5 right-1.5 bg-overlay-primary/80 backdrop-blur-sm text-xs font-medium text-primary px-1.5 py-0.5 rounded-xs">
            ${(template.price_cents / 100).toFixed(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-medium text-primary truncate">{template.name}</p>

      {/* Category badge */}
      <Badge color={badgeColor} className="text-[10px]">
        {template.category}
      </Badge>

      {/* Stats row */}
      <div className="flex items-center gap-2 text-xs text-tertiary">
        <span>{formatInstallCount(template.install_count)} installs</span>
        <span className="text-warning-400">{renderStars(template.rating_average)}</span>
        <span>{template.rating_average.toFixed(1)}</span>
      </div>

      {/* Action */}
      <Button
        variant="tertiary-alt"
        size="xs"
        onClick={() => onApply(template)}
        loading={isApplying}
      >
        Use Template
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TemplatePanel
// ---------------------------------------------------------------------------

/**
 * TemplatePanel - Right-drawer panel for browsing and applying page templates.
 *
 * Features:
 * - Search bar with icon
 * - Horizontal scrollable category filter chips
 * - 2-column grid of template cards with thumbnail, name, stats, and apply button
 * - Loading skeletons and empty state
 * - Apply template action that updates pageConfigAtom
 */
export function TemplatePanel() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryFilter>('all');
  const [isLoading, setIsLoading] = React.useState(true);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [applyingId, setApplyingId] = React.useState<string | null>(null);

  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const ownerType = useAtomValue(ownerTypeAtom);

  // --- Data fetch simulation ---
  // TODO: Replace with real LIST_TEMPLATES query via useQuery / graphql-request
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setTemplates(MOCK_TEMPLATES);
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // --- Filtering ---

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((tpl) => {
      // Category filter
      if (selectedCategory !== 'all' && tpl.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tpl.name.toLowerCase().includes(q) ||
          tpl.description.toLowerCase().includes(q) ||
          tpl.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          tpl.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [templates, selectedCategory, searchQuery]);

  // --- Apply template ---

  const handleApplyTemplate = async (template: Template) => {
    setApplyingId(template._id);

    try {
      // TODO: Wire up CLONE_TEMPLATE_TO_CONFIG mutation for server-side cloning.
      // For now, merge the template's sections and theme into the current page config.
      setPageConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: template.config.sections ?? prev.sections,
          theme: template.config.theme ?? prev.theme,
          template_id: template._id,
          template_version_installed: template.version,
        };
      });

      setIsDirty(true);
      toast.success(`Template "${template.name}" applied`);
    } catch {
      toast.error('Failed to apply template. Please try again.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
        <span className="text-sm font-medium text-primary">Templates</span>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </div>

      {/* --- Search + Filters --- */}
      <div className="px-4 pt-3 pb-2 space-y-3 border-b border-card-border">
        <InputField
          iconLeft="icon-search"
          placeholder="Search templates..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Category chips — horizontal scroll */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={clsx(
                'px-2.5 py-1 rounded-xs text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0',
                selectedCategory === cat
                  ? 'bg-primary/12 text-primary'
                  : 'bg-primary/4 text-tertiary hover:text-secondary hover:bg-primary/8',
              )}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* --- Template Grid --- */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <TemplateCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <i className="icon-search size-8 text-tertiary" />
            <p className="text-sm text-tertiary text-center">
              No templates match your search.
            </p>
            <Button
              variant="tertiary-alt"
              size="xs"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((tpl) => (
              <TemplateCard
                key={tpl._id}
                template={tpl}
                onApply={handleApplyTemplate}
                isApplying={applyingId === tpl._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
