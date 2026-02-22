'use client';

import React from 'react';
import clsx from 'clsx';
import { useAtomValue, useSetAtom } from 'jotai';

import { Button, Skeleton, Badge } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';
import { useQuery, useMutation } from '$lib/graphql/request/hooks';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { pageConfigAtom, isDirtyAtom, ownerTypeAtom, ownerIdAtom, configIdAtom } from '../store';
import type { Template, TemplateCategory, TemplateTarget } from '../types';
import { LIST_TEMPLATES, CLONE_TEMPLATE_TO_CONFIG } from '../queries';

type AnyDocument = TypedDocumentNode<any, any>;

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
  const [applyingId, setApplyingId] = React.useState<string | null>(null);

  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const ownerType = useAtomValue(ownerTypeAtom);
  const ownerId = useAtomValue(ownerIdAtom);
  const configId = useAtomValue(configIdAtom);

  // --- Fetch templates ---
  const { data: templatesData, loading: isLoading } = useQuery(LIST_TEMPLATES as AnyDocument);

  const templates: Template[] = templatesData?.listTemplates ?? [];

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
  const [cloneTemplate] = useMutation(CLONE_TEMPLATE_TO_CONFIG as AnyDocument);

  const handleApplyTemplate = async (template: Template) => {
    setApplyingId(template._id);

    try {
      const { data, error } = await cloneTemplate({
        variables: { templateId: template._id, ownerType, ownerId },
      });

      if (error) throw error;

      const clonedConfig = data?.cloneTemplateToConfig;
      if (clonedConfig) {
        setPageConfig(clonedConfig);
      }

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
