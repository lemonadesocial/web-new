'use client';
import React from 'react';
import { format } from 'date-fns';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { convertFromUtcToTimezone } from '$lib/utils/date';

interface SpotlightEventCardProps {
  event: Event;
  isSelected?: boolean;
  showRemove?: boolean;
  onToggle?: (event: Event) => void;
  onRemove?: (eventId: string) => void;
}

export function SpotlightEventCard({ event, isSelected, showRemove, onToggle, onRemove }: SpotlightEventCardProps) {
  const eventDate = convertFromUtcToTimezone(event.start, event.timezone || 'UTC');
  const eventImage = event.new_new_photos_expanded?.[0];

  const content = (
    <>
      <div className="size-8 rounded-xs border border-card-border overflow-hidden bg-card flex-shrink-0">
        {eventImage ? (
          <img
            src={generateUrl(eventImage, { resize: { height: 32, width: 32, fit: 'cover' } })}
            alt={event.title}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <i aria-hidden="true" className="icon-ticket size-4 text-tertiary" />
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <p className="line-clamp-1">{event.title}</p>
        <p className="text-xs text-tertiary">
          {format(eventDate, "MMM d 'at' h:mm a")}
        </p>
      </div>
      {showRemove && onRemove ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(event._id!);
          }}
          className="size-6 rounded-full border border-card-border flex items-center justify-center hover:bg-card-hover transition-colors flex-shrink-0"
        >
          <i aria-hidden="true" className="icon-close size-3 text-tertiary" />
        </button>
      ) : isSelected !== undefined ? (
        isSelected ? (
          <i aria-hidden="true" className="icon-check size-5" />
        ) : (
          <i aria-hidden="true" className="icon-circle-outline text-tertiary size-5" />
        )
      ) : null}
    </>
  );

  if (onToggle) {
    return (
      <button
        onClick={() => onToggle(event)}
        className="flex gap-3 items-center px-4 py-3 hover:bg-card transition-colors text-left cursor-pointer w-full"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex gap-3 items-center px-4 py-3">
      {content}
    </div>
  );
}
