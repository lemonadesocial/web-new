'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHref, sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface Hub {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  member_count?: number;
  url?: string;
}

interface SpaceHubsProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  description?: string;
  hubs?: Hub[];
  columns?: 2 | 3;
}

function HubCard({ hub }: { hub: Hub }) {
  const hasImage = hub.image_url && hub.image_url.trim().length > 0;
  const hasDescription = hub.description && hub.description.trim().length > 0;
  const hasMemberCount =
    typeof hub.member_count === 'number' && hub.member_count > 0;

  const content = (
    <div className="group overflow-hidden rounded-md border border-card-border bg-primary/4 transition hover:border-primary/20">
      {/* Hub image */}
      {hasImage ? (
        <div className="aspect-video w-full overflow-hidden bg-primary/8">
          <img
            src={sanitizeMediaSrc(hub.image_url)}
            alt={hub.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-primary/4">
          <i className="icon-community size-8 text-tertiary" />
        </div>
      )}

      {/* Card body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-primary line-clamp-1">
          {hub.name || 'Untitled Hub'}
        </h3>

        {hasDescription && (
          <p className="mt-1.5 text-xs leading-relaxed text-secondary line-clamp-2">
            {hub.description}
          </p>
        )}

        {/* Member count badge */}
        {hasMemberCount && (
          <div className="mt-3 flex items-center gap-1.5">
            <i className="icon-community size-3.5 text-tertiary" />
            <span className="text-xs font-medium text-secondary">
              {hub.member_count!.toLocaleString()} member{hub.member_count !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (hub.url) {
    return (
      <a href={sanitizeHref(hub.url)} className="block no-underline">
        {content}
      </a>
    );
  }

  return content;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-card-border bg-primary/4 px-6 py-12">
      <i className="icon-community size-8 text-tertiary" />
      <p className="mt-3 text-sm font-medium text-secondary">No hubs yet</p>
      <p className="mt-1 text-xs text-tertiary">
        Sub-communities will appear here when they are created
      </p>
    </div>
  );
}

function _SpaceHubs({
  width = 'contained',
  padding = 'lg',
  alignment,
  min_height,
  background,
  heading = 'Hubs',
  description = '',
  hubs = [],
  columns = 3,
}: SpaceHubsProps) {
  const hasHubs = hubs.length > 0;
  const hasDescription = description && description.trim().length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {heading || 'Hubs'}
        </h2>
        {hasDescription && (
          <p className="mt-2 text-sm text-secondary">{description}</p>
        )}
      </div>

      {/* Hubs grid or empty state */}
      {hasHubs ? (
        <div
          className={clsx(
            'grid gap-4',
            columns === 2 && 'grid-cols-1 sm:grid-cols-2',
            columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {hubs.map((hub) => (
            <HubCard key={hub.id} hub={hub} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </SectionWrapper>
  );
}

export const SpaceHubs = React.memo(_SpaceHubs);
SpaceHubs.craft = {
  displayName: 'SpaceHubs',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Hubs',
    description: '',
    hubs: [],
    columns: 3,
  },
};
