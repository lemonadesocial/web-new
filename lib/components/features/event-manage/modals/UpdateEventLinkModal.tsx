'use client';
import { useState } from 'react';

import { Event, UpdateEventSettingsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { Button, modal, toast, Input, ModalContent, InputField } from '$lib/components/core';

import { useUpdateEvent } from '../store';

export function UpdateEventLinkModal({ event }: { event: Event }) {
  const [shortid, setShortid] = useState(event.shortid || '');
  const updateEvent = useUpdateEvent();

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

  const handleUpdate = async () => {
    if (!shortid.trim()) {
      toast.error('Please enter a valid event link');
      return;
    }

    if (shortid === event.shortid) {
      modal.close();
      return;
    }

    updateEventSettings({
      variables: {
        id: event._id,
        input: {
          shortid: shortid.trim(),
        },
      },
    });
  };

  return (
    <ModalContent icon="icon-link" onClose={() => modal.close()} className="min-w-[480px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Event Link</p>
          <p className="text-sm text-secondary">
            When you choose a new URL, the current one will no longer work. Do not change your URL if you have already
            shared the event.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Public URL</p>
          <div className="flex ">
            <div className="flex items-center px-3.5 py-2 bg-primary/8 border border-r-0 border-primary/8 rounded-l-sm">
              <p className="text-secondary">lemonade.social/e/</p>
            </div>
            <Input
              value={shortid}
              onChange={(e) => setShortid(e.target.value)}
              className="rounded-l-none border-l-transparent"
              variant="outlined"
              placeholder="Enter custom URL"
            />
          </div>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleUpdate}
          loading={loading}
          disabled={!shortid.trim() || shortid === event.shortid}
        >
          Update
        </Button>
      </div>
    </ModalContent>
  );
}
