'use client';

import type { EventGuestDetail } from '$lib/graphql/generated/backend/graphql';
import { randomUserImage } from '$lib/utils/user';

interface GuestRowProps {
  data: EventGuestDetail;
}

const STATUS_STYLES: Record<string, string> = {
  going: 'text-green-500',
  approved: 'text-green-500',
  pending: 'text-yellow-500',
  declined: 'text-red-500',
};

export function GuestRow({ data }: GuestRowProps) {
  const displayName =
    data.user?.display_name || data.user?.name || data.user?.email || 'Anonymous guest';
  const ticketTypeTitle = data.ticket?.type_expanded?.title;
  const checkedIn = data.ticket?.checkin?.active ?? false;
  const status = data.join_request?.state ?? 'pending';
  const statusStyle = STATUS_STYLES[status] || 'text-tertiary';
  const avatarUrl = randomUserImage(data.user?._id ?? displayName);

  return (
    <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card cursor-default">
      <img
        src={avatarUrl}
        alt={displayName}
        className="size-[38px] rounded-full object-cover shrink-0 border border-card-border"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary truncate">{displayName}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {ticketTypeTitle && (
            <span className="text-sm text-tertiary">{ticketTypeTitle}</span>
          )}
          <span className={`text-sm capitalize ${statusStyle}`}>{status}</span>
        </div>
      </div>
      <div className="shrink-0">
        {checkedIn ? (
          <i aria-hidden="true" className="icon-done size-4 text-green-500" />
        ) : (
          <i aria-hidden="true" className="icon-x size-4 text-tertiary" />
        )}
      </div>
    </div>
  );
}
