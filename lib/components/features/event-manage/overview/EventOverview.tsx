'use client';
import { modal } from '$lib/components/core';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';

import { useEvent } from '../store';
import { InviteGuestsModal } from '../modals/InviteGuestsModal';
import { InviteFriendModal } from '../../modals/InviteFriendModal';
import { EventAccessInfo } from './EventAccessInfo';
import { ManageHost } from './ManageHost';
import { PaymentOverview } from './PaymentOverview';
import { EventRecap } from './EventRecap';
import { EventInvites } from './EventInvites';
import { GuestsOverview } from './GuestsOverview';
import { VisibilityDiscovery } from './VisibilityDiscovery';
import { BlastAdvancedModal } from '../modals/EventBlastsModal';

export function EventOverview() {
  const event = useEvent();

  if (!event) return null;

  const isEventEnded = event.end && new Date(event.end) < new Date();

  return (
    <div className="space-y-8">
      {isEventEnded ? (
        <EventRecap event={event} />
      ) : (
        <>
          <div className="flex md:grid md:grid-cols-4 gap-2 overflow-auto no-scrollbar">
            <div
              className="py-2 px-3 items-center flex gap-3 rounded-md border border-card-border bg-card cursor-pointer min-w-fit"
              onClick={() => modal.open(InviteGuestsModal, { props: { event }, dismissible: true })}
            >
              <div className="size-[38px] aspect-square rounded-sm bg-blue-400/16 flex items-center justify-center">
                <i className="icon-person-add size-5 text-blue-400" />
              </div>
              <p>Invite Guests</p>
            </div>
            <div
              className="py-2 px-3 items-center flex gap-3 rounded-md border border-card-border bg-card cursor-pointer  min-w-fit"
              onClick={() => window.open(`${LEMONADE_DOMAIN}/manage/event/${event.shortid}/check-in`, '_blank')}
            >
              <div className="size-[38px] aspect-square rounded-sm bg-success-500/16 flex items-center justify-center">
                <i className="icon-qr size-5 text-success-500" />
              </div>
              <p>Check In Guests</p>
            </div>
            <div
              className="py-2 px-3 items-center flex gap-3 rounded-md border border-card-border bg-card cursor-pointer  min-w-fit"
              onClick={() => modal.open(BlastAdvancedModal, { dismissible: false, props: { event, message: '' } })}
            >
              <div className="size-[38px] aspect-square rounded-sm bg-[#C084FC]/16 flex items-center justify-center">
                <i className="icon-email size-5 text-[#C084FC]" />
              </div>
              <p>Send a Blast</p>
            </div>
            <div
              className="py-2 px-3 items-center flex gap-3 rounded-md border border-card-border bg-card cursor-pointer  min-w-fit"
              onClick={() => modal.open(InviteFriendModal, { props: { event }, dismissible: true })}
            >
              <div
                className="size-[38px] aspect-square rounded-sm flex items-center justify-center"
                style={{ background: 'rgba(244, 114, 182, 0.16)' }}
              >
                <i className="icon-person-add size-5 text-[#F472B6]" />
              </div>
              <p>Share Event</p>
            </div>
          </div>

          <EventAccessInfo event={event} />
        </>
      )}

      <EventInvites event={event} />

      <hr className="border-t" />

      <GuestsOverview event={event} />

      <hr className="border-t" />

      <ManageHost event={event} />

      <PaymentOverview event={event} />

      <hr className="border-t" />

      <VisibilityDiscovery event={event} />
    </div>
  );
}
