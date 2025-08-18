'use client';
import clsx from 'clsx';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { FileInput } from '$lib/components/core/file-input/file-input';
import { uploadFiles } from '$lib/utils/file';
import { useMutation } from '$lib/graphql/request';
import { UpdateEventPhotosDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, drawer, modal, toast } from '$lib/components/core';

import { EventThemeProvider } from '../../theme-builder/provider';
import { EventGuestSideContent } from '../../event/EventGuestSide';
import { EventThemeLayout } from '../EventThemeLayout';
import { EditEventDrawer } from '../drawers/EditEventDrawer';
import { InviteFriendModal } from '../../modals/InviteFriendModal';

import { useUpdateEvent } from '../store';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { getEventDateBlockRange, getEventDateBlockStart } from '$lib/utils/event';
import { UpdateEventLinkModal } from '../modals/UpdateEventLinkModal';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';

export function EventAccessInfo({ event }: { event: Event }) {
  const [uploading, setUploading] = useState(false);
  const updateEvent = useUpdateEvent();

  const router = useRouter();

  const accessMissing = !event.address && !event.virtual_url;

  const shareUrl = `${window.location.origin}/e/${event.shortid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Copied event link!');
    });
  };

  const [updatePhotos] = useMutation(UpdateEventPhotosDocument);

  const handleFileChange = async (files: File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await uploadFiles([files[0]], 'event');
      const fileId = res[0]._id;
      const { data } = await updatePhotos({ variables: { id: event._id, new_new_photos: [fileId] } });

      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
      }

      toast.success('Photo updated!');
    } catch (e) {
      toast.error('Failed to update photo');
    }
    setUploading(false);
  };

  return (
    <div className="rounded-md border border-card-border bg-card p-3 flex flex-col md:grid grid-cols-2 gap-5">
      <div className="space-y-4">
        <div className="h-[320px] rounded-sm overflow-hidden relative">
          <div className="absolute scale-50 origin-top-left w-[200%]">
            <EventThemeProvider themeData={event.theme_data}>
              <EventThemeLayout>
                <EventGuestSideContent event={event} />
              </EventThemeLayout>
            </EventThemeProvider>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 font-default">
          <p className="text-sm text-secondary truncate">{`${window.location.host}/e/${event.shortid}`}</p>
          <div className="flex items-center gap-4">
            <i
              className="icon-edit-sharp text-tertiary size-5 cursor-pointer"
              onClick={() => modal.open(UpdateEventLinkModal, { props: { event } })}
            />
            <i className="icon-copy text-tertiary size-5 cursor-pointer" onClick={handleCopy} />
            <i
              className="icon-share text-tertiary size-5 cursor-pointer"
              onClick={() => modal.open(InviteFriendModal, { props: { event }, dismissible: true })}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 font-default">
        <p className="text-lg">When & Where</p>

        <div className="space-y-4 flex-1">
          <div className="flex gap-4 w-full text-nowrap">
            <div className="border rounded-sm size-12 min-w-12 flex flex-col overflow-hidden">
              <div className="bg-card w-full h-4.5 border-b border-b-divider">
                <p className="text-[10px] text-center">
                  {format(convertFromUtcToTimezone(event.start, event.timezone as string), 'MMM')}
                </p>
              </div>
              <p className="text-center">
                {format(convertFromUtcToTimezone(event.start, event.timezone as string), 'dd')}
              </p>
            </div>
            <div className="flex flex-col truncate">
              <p>{getEventDateBlockStart(event)}</p>
              <span className="text-sm text-secondary">{getEventDateBlockRange(event)}</span>
            </div>
          </div>
          {event.address ? (
            <div className="flex gap-4 w-full">
              <div className="border rounded-sm size-12 min-w-12 flex items-center justify-center">
                <i className="icon-location-outline text-tertiary" />
              </div>
              <div className="truncate">
                <p className="truncate">
                  {event.address.title} <i className="icon-arrow-outward text-quaternary size-[18px]" />
                </p>
                <span className="text-sm text-secondary">
                  {[event.address.city || event.address.region, event.address.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="border rounded-sm size-12 min-w-12 flex items-center justify-center">
                <i className="icon-alert-outline text-tertiary" />
              </div>
              <div>
                <p className={clsx(accessMissing && 'text-warning-300')}>
                  {accessMissing ? 'Location Missing' : 'Add Location'}
                </p>
                <span className="text-sm text-secondary">Please enter the location of the event before it starts.</span>
              </div>
            </div>
          )}
          {event.virtual_url ? (
            <div className="flex gap-4 flex-1 w-full">
              <div className="border rounded-sm size-12 min-w-12 flex items-center justify-center">
                <i className="icon-video text-tertiary" />
              </div>
              <div className="truncate">
                <p className="truncate">Virtual Link</p>
                <span className="text-sm text-secondary">{event.virtual_url}</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <div className="border rounded-sm size-12 min-w-12 flex items-center justify-center">
                <i className="icon-alert-outline text-tertiary" />
              </div>
              <div>
                <p className={clsx(accessMissing && 'text-warning-300')}>
                  {accessMissing ? 'Virtual Link Missing' : 'Add Virtual Link'}
                </p>
                <span className="text-sm text-secondary">
                  Please enter the virtual link of the event before it starts.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant="tertiary"
            size="sm"
            iconLeft="icon-qr"
            onClick={() => window.open(`${LEMONADE_DOMAIN}/manage/event/${event.shortid}/check-in`, '_blank')}
            className="w-full"
          >
            Check In Guests
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => drawer.open(EditEventDrawer, { props: { event }, dismissible: false })}
              className="flex-1"
            >
              Edit Event
            </Button>
            <FileInput onChange={handleFileChange} multiple={false} accept="image/*" className="flex-1">
              {(open) => (
                <Button
                  variant="tertiary-alt"
                  size="sm"
                  className="w-full"
                  onClick={open}
                  loading={uploading}
                  disabled={uploading}
                >
                  Change Photo
                </Button>
              )}
            </FileInput>
          </div>
        </div>
      </div>
    </div>
  );
}
