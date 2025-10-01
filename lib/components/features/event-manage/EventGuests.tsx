'use client';

import { GuestList } from './GuestList';
import { useEvent } from './store';

import { Card, modal } from '$lib/components/core';
import { PublicGuestListModal } from './modals/PublicGuestListModal';
import { InviteGuestsModal } from './modals/InviteGuestsModal';
import { PendingApprovalsOverview } from './common/PendingApprovalsOverview';
import { GuestStats } from './common/GuestStats';

export function EventGuests() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">At a Glance</h2>
        <GuestStats event={event} />
        <div className="flex gap-2 overflow-auto no-scrollbar">
          <Card.Root className="flex-1 min-w-fit" onClick={() => modal.open(InviteGuestsModal, { props: { event } })}>
            <Card.Content className="flex gap-3 p-2 items-center pr-3">
              <div className="flex items-center justify-center rounded-sm p-2 bg-alert-400/[0.16] w-[38px] aspect-square">
                <i className="icon-user-plus size-[22px] text-alert-400" />
              </div>
              <p>Invite Guests</p>
            </Card.Content>
          </Card.Root>

          <Card.Root
            className="flex-1 min-w-fit"
            onClick={() => modal.open(InviteGuestsModal, { props: { event, title: 'Add Guests', mode: 'guests' } })}
          >
            <Card.Content className="flex gap-3 p-2 items-center pr-3">
              <div className="flex items-center justify-center rounded-sm p-2 bg-accent-400/[0.16] w-[38px] aspect-square">
                <i className="icon-ticket-assign size-[22px] text-accent-400" />
              </div>
              <p>Add Guests</p>
            </Card.Content>
          </Card.Root>

          <Card.Root
            className="flex-1 min-w-fit"
            onClick={() => (window.location.href = `/manage/event/${event.shortid}/check-in`)}
          >
            <Card.Content className="flex gap-3 p-2 items-center pr-3">
              <div className="flex items-center justify-center rounded-sm p-2 bg-success-400/[0.16] w-[38px] aspect-square">
                <i className="icon-qr size-[22px] text-success-400" />
              </div>
              <p>Check In Guests</p>
            </Card.Content>
          </Card.Root>

          <Card.Root className="flex-1 min-w-fit" onClick={() => modal.open(PublicGuestListModal, { props: { event } })}>
            <Card.Content className="flex gap-3 p-2 items-center pr-3">
              <div className="flex items-center justify-center rounded-sm p-2 bg-warning-400/[0.16] w-[38px] aspect-square">
                <i className="icon-user-group-outline size-[22px] text-warning-400" />
              </div>
              <div>
                <p>Guest List</p>
                <p className="text-tertiary text-xs">{event.hide_attending === true ? 'Private' : 'Shown to guests'}</p>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>

      <PendingApprovalsOverview event={event} />
      <GuestList event={event} />
    </div>
  );
}
