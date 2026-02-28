'use client';

import React from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface Speaker {
  id?: string;
  name: string;
  title?: string;
  company?: string;
  avatar_url?: string;
  bio?: string;
}

function EventSpeakersInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  speakers,
  columns,
  show_bio,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  speakers?: Speaker[];
  columns?: 2 | 3 | 4;
  show_bio?: boolean;
}) {
  const displayHeading = heading || 'Speakers';
  const speakerList = Array.isArray(speakers) ? (speakers as Speaker[]) : [];
  const hasSpeakers = speakerList.length > 0;
  const cols = columns || 3;

  const gridColsClass =
    cols === 2
      ? 'sm:grid-cols-2'
      : cols === 4
        ? 'sm:grid-cols-2 lg:grid-cols-4'
        : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {displayHeading}
        </h2>

        {hasSpeakers ? (
          <div className={clsx('grid gap-6', gridColsClass)}>
            {speakerList.map((speaker, index) => (
              <div
                key={speaker.id || `speaker-${index}`}
                className="flex flex-col items-center gap-3 rounded-lg border border-card-border bg-primary/4 p-6 text-center"
              >
                {/* Avatar */}
                {speaker.avatar_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={sanitizeMediaSrc(speaker.avatar_url)}
                    alt={speaker.name}
                    className="size-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-overlay-primary text-2xl font-bold text-primary">
                    {speaker.name
                      ? speaker.name.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                )}

                {/* Name */}
                <h3 className="text-base font-semibold text-primary">
                  {speaker.name || 'Speaker Name'}
                </h3>

                {/* Title & Company */}
                {(speaker.title || speaker.company) && (
                  <p className="text-sm text-secondary">
                    {[speaker.title, speaker.company]
                      .filter(Boolean)
                      .join(' at ')}
                  </p>
                )}

                {/* Bio */}
                {show_bio && speaker.bio && (
                  <p className="text-xs text-tertiary leading-relaxed line-clamp-3">
                    {speaker.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty placeholder */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 px-6 py-12">
            <svg
              className="size-8 text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No speakers added
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add speakers to showcase your event lineup
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventSpeakers = React.memo(EventSpeakersInner);
EventSpeakers.craft = {
  displayName: 'EventSpeakers',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Speakers',
    speakers: [],
    columns: 3,
    show_bio: false,
  },
};
