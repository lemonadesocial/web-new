'use client';

import React from 'react';

/**
 * Thin placeholder rendered for every section type until the real
 * implementations are created (FE-3).
 *
 * When used inside the Craft.js <Frame>, the component receives its
 * section label via `sectionLabel` prop.  The editor shell passes this
 * through the node's custom props.
 */

interface PlaceholderSectionProps {
  sectionLabel?: string;
  [key: string]: unknown;
}

export function PlaceholderSection({ sectionLabel = 'Section' }: PlaceholderSectionProps) {
  return (
    <div className="flex items-center justify-center border border-dashed border-card-border rounded-sm bg-primary/4 min-h-[120px] px-6 py-8 my-2 select-none">
      <div className="flex flex-col items-center gap-2 text-center">
        <i className="icon-grid-view size-6 text-tertiary" />
        <p className="text-sm font-medium text-secondary">{sectionLabel}</p>
        <p className="text-xs text-tertiary">Section preview coming soon</p>
      </div>
    </div>
  );
}
