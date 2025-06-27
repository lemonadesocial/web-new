'use client';
import { modal } from "$lib/components/core";
import { useEvent } from "./store";
import { InviteGuestsModal } from "./modals/InviteGuestsModal";
import { InviteFriendModal } from "../modals/InviteFriendModal";
import { EventThemeProvider } from "../theme-builder/provider";
import EventGuestSide from "../event/EventGuestSide";
import { EventThemeLayout } from "./EventThemeLayout";

export function EventOverview() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-2">
        <div
          className="py-2 px-3 items-center flex gap-3 rounded-md border border-card-border bg-card cursor-pointer"
          onClick={() => modal.open(InviteGuestsModal, { props: { event }, dismissible: true })}
        >
          <div className="size-[38px] rounded-sm bg-blue-400/16 flex items-center justify-center">
            <i className="icon-person-add size-5 text-blue-400" />
          </div>
          <p>Invite Guests</p>
        </div>
        <div
          className="py-2 px-3 items-center flex gap-3 rounded-md border border-card-border bg-card cursor-pointer"
          onClick={() => modal.open(InviteFriendModal, { props: { event }, dismissible: true })}
        >
          <div className="size-[38px] rounded-sm flex items-center justify-center" style={{ background: 'rgba(244, 114, 182, 0.16)' }}>
            <i className="icon-person-add size-5 text-[#F472B6]" />
          </div>
          <p>Share Event</p>
        </div>
      </div>
      <div className="rounded-md border border-card-border bg-card p-3 grid grid-cols-2 gap-5">
        <div className="h-[320px] rounded-sm overflow-hidden relative">
          <div className="absolute scale-50 origin-top-left w-[200%]">
            <EventThemeProvider themeData={event.theme_data}>
              <EventThemeLayout>
                <EventGuestSide event={event} />
              </EventThemeLayout>
            </EventThemeProvider>
          </div>
        </div>
        <div>
          hello
        </div>
      </div>
    </div>
  );
}
