'use client';

import React from 'react';
import clsx from 'clsx';
import { useAtom, useSetAtom } from 'jotai';

import { Button } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';

import { pageConfigAtom, isDirtyAtom } from '../store';
import type { SEOConfig, StructuredDataType } from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const OG_TYPE_OPTIONS = ['website', 'article', 'event'] as const;
type OGType = (typeof OG_TYPE_OPTIONS)[number];

const STRUCTURED_DATA_OPTIONS: StructuredDataType[] = ['Event', 'Organization', 'WebPage'];

const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCharCountColor(current: number, max: number): string {
  const ratio = current / max;
  if (ratio > 1) return 'text-danger-400';
  if (ratio > 0.9) return 'text-warning-400';
  return 'text-tertiary';
}

// ---------------------------------------------------------------------------
// SEOPanel
// ---------------------------------------------------------------------------

/**
 * SEOPanel - Right-drawer panel for configuring page SEO metadata.
 *
 * Features:
 * - Meta title with character counter (max 60)
 * - Meta description with character counter (max 160)
 * - OG image URL with inline preview
 * - OG type selector (website / article / event)
 * - Canonical URL input
 * - No-index toggle
 * - Structured data type selector
 * - Live Google search preview card
 *
 * All changes write back to pageConfigAtom.seo and set isDirtyAtom = true.
 */
export function SEOPanel() {
  const [config, setConfig] = useAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);

  // Derive SEO state from config
  const seo = config?.seo ?? {};

  // --- Update helper ---

  const updateSEO = (patch: Partial<SEOConfig>) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        seo: {
          ...prev.seo,
          ...patch,
        },
      };
    });
    setIsDirty(true);
  };

  // --- Field values ---

  const metaTitle = seo.meta_title ?? '';
  const metaDescription = seo.meta_description ?? '';
  const ogImageUrl = seo.og_image_url ?? '';
  const ogType = (seo.og_type ?? 'website') as OGType;
  const canonicalUrl = seo.canonical_url ?? '';
  const noIndex = seo.no_index ?? false;
  const structuredDataType = seo.structured_data?.type ?? 'Event';

  // --- Preview values ---

  const previewTitle = metaTitle || config?.name || 'Page Title';
  const previewUrl = canonicalUrl || 'https://lemonade.social/e/your-event';
  const previewDescription = metaDescription || config?.description || 'Add a meta description to improve search visibility...';

  return (
    <div className="flex flex-col h-full">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
        <span className="text-sm font-medium text-primary">SEO Settings</span>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </div>

      {/* --- Form Content --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Auto-fill from page data */}
        {(!metaTitle || !metaDescription) && (config?.name || config?.description) && (
          <div className="rounded-sm border border-dashed border-card-border bg-primary/4 p-3 space-y-2">
            <p className="text-xs text-secondary">
              Auto-fill SEO fields from your page data?
            </p>
            <Button
              variant="tertiary-alt"
              size="xs"
              onClick={() => {
                const patch: Partial<SEOConfig> = {};
                if (!metaTitle && config?.name) {
                  patch.meta_title = config.name.slice(0, META_TITLE_MAX);
                }
                if (!metaDescription && config?.description) {
                  patch.meta_description = config.description.slice(0, META_DESCRIPTION_MAX);
                }
                if (Object.keys(patch).length > 0) {
                  updateSEO(patch);
                }
              }}
            >
              Auto-fill
            </Button>
          </div>
        )}

        {/* Meta Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Meta Title</label>
          <InputField
            placeholder={config?.name || 'Enter page title for search engines...'}
            value={metaTitle}
            onChangeText={(val) => updateSEO({ meta_title: val })}
          />
          <p className={clsx('text-xs', getCharCountColor(metaTitle.length, META_TITLE_MAX))}>
            {metaTitle.length}/{META_TITLE_MAX} characters
          </p>
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Meta Description</label>
          <div className="space-y-1">
            <textarea
              className="w-full min-h-[72px] px-3 py-2 rounded-sm border border-card-border bg-primary/4 text-sm text-primary placeholder:text-tertiary resize-y focus:outline-none focus:border-primary/40 transition"
              placeholder={config?.description || 'Write a compelling description for search results...'}
              value={metaDescription}
              onChange={(e) => updateSEO({ meta_description: e.target.value })}
              rows={3}
            />
          </div>
          <p className={clsx('text-xs', getCharCountColor(metaDescription.length, META_DESCRIPTION_MAX))}>
            {metaDescription.length}/{META_DESCRIPTION_MAX} characters
          </p>
        </div>

        {/* OG Image */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">OG Image</label>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <InputField
                placeholder="https://example.com/og-image.jpg"
                value={ogImageUrl}
                onChangeText={(val) => updateSEO({ og_image_url: val })}
                iconLeft="icon-image"
              />
            </div>
            {ogImageUrl && (
              <div className="w-16 h-10 rounded-xs overflow-hidden bg-primary/4 shrink-0">
                <img
                  src={ogImageUrl}
                  alt="OG preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* OG Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">OG Type</label>
          <div className="flex gap-1">
            {OG_TYPE_OPTIONS.map((option) => (
              <button
                key={option}
                className={clsx(
                  'flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
                  ogType === option
                    ? 'bg-primary/12 text-primary'
                    : 'text-tertiary hover:bg-primary/4',
                )}
                onClick={() => updateSEO({ og_type: option })}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Canonical URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Canonical URL</label>
          <InputField
            placeholder="https://lemonade.social/e/your-event"
            value={canonicalUrl}
            onChangeText={(val) => updateSEO({ canonical_url: val })}
            iconLeft="icon-globe"
          />
          <p className="text-xs text-tertiary">
            Set if this page is available at multiple URLs.
          </p>
        </div>

        {/* No Index */}
        <div className="flex items-center justify-between py-1">
          <div className="space-y-0.5">
            <label className="text-xs font-medium text-secondary">No Index</label>
            <p className="text-xs text-tertiary">Hide this page from search engines</p>
          </div>
          <button
            className={clsx(
              'relative w-9 h-5 rounded-full transition-colors cursor-pointer',
              noIndex ? 'bg-accent-500' : 'bg-primary/12',
            )}
            onClick={() => updateSEO({ no_index: !noIndex })}
            role="switch"
            aria-checked={noIndex}
          >
            <span
              className={clsx(
                'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
                noIndex ? 'translate-x-[18px]' : 'translate-x-0.5',
              )}
            />
          </button>
        </div>

        {/* Structured Data Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Structured Data Type</label>
          <div className="flex gap-1">
            {STRUCTURED_DATA_OPTIONS.map((option) => (
              <button
                key={option}
                className={clsx(
                  'flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
                  structuredDataType === option
                    ? 'bg-primary/12 text-primary'
                    : 'text-tertiary hover:bg-primary/4',
                )}
                onClick={() =>
                  updateSEO({
                    structured_data: {
                      type: option,
                      custom: seo.structured_data?.custom,
                    },
                  })
                }
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-xs text-tertiary">
            Helps search engines understand your page content.
          </p>
        </div>

        {/* --- Separator --- */}
        <div className="border-t border-card-border" />

        {/* --- Google Search Preview --- */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary uppercase tracking-wide">
            Search Preview
          </label>

          <div className="rounded-sm border border-card-border bg-primary/4 p-3 space-y-1">
            {/* URL line */}
            <p className="text-xs text-green-400 truncate">
              {previewUrl}
            </p>

            {/* Title */}
            <p className="text-sm font-medium text-blue-400 leading-snug">
              {previewTitle.length > META_TITLE_MAX
                ? `${previewTitle.slice(0, META_TITLE_MAX)}...`
                : previewTitle}
            </p>

            {/* Description */}
            <p className="text-xs text-tertiary leading-relaxed">
              {previewDescription.length > META_DESCRIPTION_MAX
                ? `${previewDescription.slice(0, META_DESCRIPTION_MAX)}...`
                : previewDescription}
            </p>
          </div>

          <p className="text-[10px] text-tertiary text-center">
            This is an approximation of how your page may appear in Google search results.
          </p>
        </div>
      </div>
    </div>
  );
}
