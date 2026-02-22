'use client';

import React from 'react';
import clsx from 'clsx';

import { Button, Badge } from '$lib/components/core';

import type { Template, TemplateChangelog } from '../types';

import { formatInstallCount, renderStars } from '../utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CREATOR_TYPE_LABELS: Record<string, string> = {
  platform: 'Official',
  designer: 'Designer',
  community: 'Community',
};

const CREATOR_TYPE_COLORS: Record<string, string> = {
  platform: '#6366f1',
  designer: '#f59e0b',
  community: '#10b981',
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChangelogSection({ changelog }: { changelog: TemplateChangelog[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
        Changelog
      </h3>
      <div className="space-y-2">
        {changelog.map((entry) => (
          <div
            key={entry.version}
            className="text-sm pl-3 border-l-2 border-card-border"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary">v{entry.version}</span>
              <span className="text-xs text-tertiary">{entry.date}</span>
              {entry.breaking_changes && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-danger-500/12 text-danger-400 font-medium">
                  Breaking
                </span>
              )}
            </div>
            <p className="text-xs text-secondary mt-0.5">{entry.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewGallery({ urls }: { urls: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
        Preview Gallery
      </h3>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {urls.map((url, index) => (
          <div
            key={url}
            className="w-40 h-24 rounded-sm overflow-hidden bg-primary/4 shrink-0"
          >
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TemplateDetailModalProps {
  template: Template;
  onApply: (template: Template) => void;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// TemplateDetailModal
// ---------------------------------------------------------------------------

/**
 * TemplateDetailModal - Full preview overlay for template details.
 *
 * Features:
 * - Large thumbnail image (aspect-video)
 * - Template info: name, description, category, creator type, rating, installs
 * - Preview gallery (horizontal scroll of screenshots)
 * - Changelog (version history)
 * - "Use Template" primary CTA
 * - "Preview Live" secondary button (opens preview URL in new tab)
 */
export function TemplateDetailModal({
  template,
  onApply,
  onClose,
}: TemplateDetailModalProps) {
  const [isApplying, setIsApplying] = React.useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      onApply(template);
    } finally {
      setIsApplying(false);
    }
  };

  const handlePreviewLive = () => {
    // TODO: Construct actual preview URL from template config
    const previewUrl = template.preview_urls?.[0] ?? template.thumbnail_url;
    window.open(previewUrl, '_blank', 'noopener');
  };

  const creatorLabel = CREATOR_TYPE_LABELS[template.creator_type] ?? template.creator_type;
  const creatorColor = CREATOR_TYPE_COLORS[template.creator_type] ?? '#a3a3a3';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-md bg-overlay-primary border border-card-border overflow-hidden flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-overlay-primary/80 backdrop-blur-sm text-tertiary hover:text-primary transition cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <i className="icon-x size-5" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Thumbnail */}
          <div className="aspect-video w-full bg-primary/4">
            <img
              src={template.thumbnail_url}
              alt={template.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {/* Name + badges */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-primary">{template.name}</h2>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  color={creatorColor}
                  className="text-[10px] py-0.5"
                >
                  {creatorLabel}
                </Badge>
                <Badge
                  color="#64748b"
                  className="text-[10px] py-0.5 capitalize"
                >
                  {template.category}
                </Badge>
                <Badge
                  color="#64748b"
                  className="text-[10px] py-0.5 capitalize"
                >
                  {template.target}
                </Badge>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-warning-400">
                {renderStars(template.rating_average)}
              </span>
              <span className="text-primary font-medium">
                {template.rating_average.toFixed(1)}
              </span>
              <span className="text-tertiary">
                ({template.rating_count} ratings)
              </span>
              <span className="text-primary/12">|</span>
              <span className="text-secondary">
                {formatInstallCount(template.install_count)} installs
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-secondary leading-relaxed">
              {template.description}
            </p>

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-xs bg-primary/8 text-xs text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Version + pricing info */}
            <div className="flex items-center gap-3 text-xs text-tertiary">
              <span>Version {template.version}</span>
              {template.price_cents != null && template.price_cents > 0 ? (
                <>
                  <span className="text-primary/12">|</span>
                  <span className="text-primary font-medium">
                    ${(template.price_cents / 100).toFixed(2)} {template.currency ?? 'USD'}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-primary/12">|</span>
                  <span className="text-green-400 font-medium">Free</span>
                </>
              )}
              <span className="text-primary/12">|</span>
              <span>
                Tier: {template.subscription_tier_min}
              </span>
            </div>

            {/* Preview Gallery */}
            {template.preview_urls && template.preview_urls.length > 0 && (
              <PreviewGallery urls={template.preview_urls} />
            )}

            {/* Changelog */}
            {template.changelog && template.changelog.length > 0 && (
              <ChangelogSection changelog={template.changelog} />
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 flex items-center justify-between gap-3 px-5 py-3 border-t border-card-border bg-overlay-primary backdrop-blur-2xl">
          <Button
            variant="tertiary-alt"
            size="sm"
            iconLeft="icon-open-in-new"
            onClick={handlePreviewLive}
          >
            Preview Live
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            loading={isApplying}
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
}
