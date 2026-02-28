'use client';

import { Card } from '$lib/components/core';
import { type GuestCardData, getLetterPlaceholder } from './utils';

interface GuestRowProps {
  data: GuestCardData;
}

const STATUS_STYLES: Record<string, string> = {
  going: 'text-green-500',
  pending: 'text-yellow-500',
  declined: 'text-red-500',
};

export function GuestRow({ data }: GuestRowProps) {
  const displayName = data.name || data.email || 'Anonymous guest';
  const placeholder = getLetterPlaceholder(displayName);
  const statusStyle = STATUS_STYLES[data.status] || 'text-tertiary';

  return (
    <Card.Root className="flex items-center gap-3 p-3 cursor-default">
      <div
        className={`${placeholder.bgColor} size-8 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-semibold`}
      >
        {placeholder.letter}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-primary truncate">{displayName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {data.ticket_type_title && (
            <span className="text-xs text-tertiary">
              {data.ticket_type_title}
            </span>
          )}
          <span className={`text-xs capitalize ${statusStyle}`}>
            {data.status}
          </span>
        </div>
      </div>
      <div className="shrink-0">
        {data.checked_in ? (
          <i
            aria-hidden="true"
            className="icon-done size-4 text-green-500"
          />
        ) : (
          <i
            aria-hidden="true"
            className="icon-x size-4 text-tertiary"
          />
        )}
      </div>
    </Card.Root>
  );
}
