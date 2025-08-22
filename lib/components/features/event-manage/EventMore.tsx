'use client';
import React from 'react';

import { Button, Divider, InputField, modal, toast } from '$lib/components/core';
import {
  CancelEventDocument,
  GetSpacesDocument,
  Space,
  SpaceRole,
  UpdateEventSettingsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useRouter } from 'next/navigation';
import { useEvent, useUpdateEvent } from './store';
import { ConfirmModal } from '../modals/ConfirmModal';
import { CloneEventModal } from './modals/CloneEventModal';

export function EventMore() {
  const router = useRouter();
  const event = useEvent();
  const updateEvent = useUpdateEvent();

  const [shortid, setShortid] = React.useState(event?.shortid || '');

  const [updateEventSettings, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent);
        toast.success('Event link updated successfully!');
        modal.close();

        const newUrl = `${window.location.origin}/e/manage/${shortid}`;
        window.location.href = newUrl;
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event link');
    },
  });

  const [deleteEvent] = useMutation(CancelEventDocument, {
    onComplete: () => {
      toast.success(`${event?.title} was cancelled successfully`);
      router.push('/events');
    },
  });

  const { data: dataCommunity, loading: loadingCommunities } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: true, roles: [SpaceRole.Admin, SpaceRole.Creator] },
  });
  const communities = (dataCommunity?.listSpaces as Space[])?.slice().sort((a, _) => (a.personal ? -1 : 1)) || [];

  if (!event || loadingCommunities) return null;

  const handleUpdate = async () => {
    if (!shortid.trim()) {
      toast.error('Please enter a valid event link');
      return;
    }

    await updateEventSettings({
      variables: {
        id: event._id,
        input: {
          shortid: shortid.trim(),
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <Section
        title="Clone Event"
        subtitle="Create a new event with the same information as this one. Everything except the guest list and event blasts will be copied over."
      >
        <div>
          <Button
            iconLeft="icon-duplicate"
            variant="secondary"
            onClick={() =>
              modal.open(CloneEventModal, {
                className: 'overflow-visible',
                props: { event, communities },
                dismissible: false,
              })
            }
          >
            Clone Event
          </Button>
        </div>
      </Section>

      <Divider className="h-1" />

      <Section
        title="Event Link"
        subtitle="When you choose a new URL, the current one will no longer work. Do not change your URL if you have already shared the event."
      >
        <div className="flex gap-2 items-end">
          <InputField
            label="Public URL"
            value={shortid}
            onChangeText={(text) => setShortid(text)}
            prefix="lemonade.social/e/"
          />
          <Button variant="secondary" disabled={!shortid} loading={loading} onClick={handleUpdate}>
            Update
          </Button>
        </div>
      </Section>

      <Divider className="h-1" />

      <Section
        title="Cancel Event"
        subtitle="Cancel and permanently delete this event. This operation cannot be undone. If there are any registered guests, we will notify them that the event has been canceled."
      >
        <div>
          <Button
            iconLeft="icon-cancel"
            variant="danger"
            onClick={() =>
              modal.open(ConfirmModal, {
                props: {
                  title: 'Cancel Event',
                  subtitle: 'The following actions will be taken immediately after cancellation.',
                  onConfirm: async () => {
                    await deleteEvent({ variables: { event: event._id } });
                  },
                },
              })
            }
          >
            Cancel Event
          </Button>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string } & React.PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold">{title}</h3>
        {subtitle && <p className="text-secondary">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}
