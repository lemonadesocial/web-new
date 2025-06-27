import { Avatar, Button, drawer, modal } from "$lib/components/core";
import { Event, GetEventInvitedStatisticsDocument, InvitationResponse, User } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { userAvatar } from "$lib/utils/user";
import { EventInvitesDrawer } from "./drawers/EventInvitesDrawer";

import { InviteGuestsModal } from "./modals/InviteGuestsModal";

export function EventInvites({ event }: { event: Event }) {
  const { data } = useQuery(GetEventInvitedStatisticsDocument, {
    variables: {
      id: event._id,
      limit: 3,
      statuses: [InvitationResponse.Accepted],
    },
  });

  const stats = data?.getEventInvitedStatistics;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Invites</h1>
          <Button
            variant="tertiary"
            size="sm"
            iconLeft="icon-plus"
            onClick={() => modal.open(InviteGuestsModal, { props: { event } })}
          >
            Invite Guests
          </Button>
        </div>
        <p className="text-secondary">Invite subscribers, contacts and past guests via email or SMS.</p>
      </div>

      {
        stats?.total ? (
          <div className="flex gap-2">
          <div className="flex flex-col justify-between py-3 px-4 rounded-md border border-card-border bg-card min-h-[170px] w-[300px]">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 items-end">
                  <p className="text-2xl leading-none">{stats?.total_joined || 0}</p>
                  <p className="text-xl text-tertiary leading-none">/</p>
                  <p className="text-xl text-tertiary leading-none">{stats?.total || 0}</p>
                </div>
  
                <i
                  className="icon-expand size-4 text-tertiary cursor-pointer"
                  onClick={() => drawer.open(EventInvitesDrawer, { props: { event } })}
                />
              </div>
  
              <p className="text-tertiary">Invites Accepted</p>
            </div>
  
            <div className="space-y-1">
              <p className="text-tertiary text-sm">{stats?.emails_opened || 0} Emails Opened</p>
              <p className="text-tertiary text-sm">{stats?.total_declined || 0} Declined</p>
            </div>
          </div>
  
          <div className="flex-1 rounded-md border border-card-border bg-card">
            <div className="py-2.5 px-4 border-b border-card-border">
              <p className="text-xs text-tertiary">RECENTLY ACCEPTED</p>
            </div>
            {stats?.guests && stats.guests.filter(guest => guest.joined).length > 0 ? (
              <div className="divide-y divide-card-border">
                {stats.guests
                  .map((guest, index) => (
                    <div key={index} className="flex items-center gap-3 py-2.5 px-4">
                      <Avatar src={userAvatar(guest)} className="size-5" />
                      <div className="flex items-center gap-2">
                        <p>{guest.user?.display_name || 'Anonymous'}</p>
                        <p className="text-tertiary">{guest.email}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 p-4">
                <div className="w-12 h-12 bg-primary/8 rounded-sm flex items-center justify-center">
                  <i className="icon-email-open size-8 text-quaternary" />
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-tertiary">No Invites Accepted... Yet.</p>
                  <p className="text-tertiary text-sm">Once people accept your invites, you will find them here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        ) : (
          <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card">
          <i className="icon-email-open size-9 text-tertiary" />
          <div>
            <p className="text-tertiary">No Invites Sent</p>
            <p className="text-tertiary text-sm">You can invite subscribers, contacts and past guests to the event.</p>
          </div>
        </div>
        )
      }
    </div>
  );
}
