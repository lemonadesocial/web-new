import { useState } from 'react';
import { Button, ModalContent, modal, toast, Menu, MenuItem } from '$lib/components/core';
import { Event, UpdateEventSettingsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useUpdateEvent } from '../store';

interface UpdateVisibilityModalProps {
  event: Event;
}

export function UpdateVisibilityModal({ event }: UpdateVisibilityModalProps) {
  const [isPrivate, setIsPrivate] = useState(!event.private);
  const updateEvent = useUpdateEvent();

  const [updateVisibility, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: () => {
      updateEvent({ private: isPrivate });
      toast.success('Event visibility updated successfully');
      modal.close();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event visibility');
    },
  });

  const handleUpdateVisibility = async () => {
    await updateVisibility({
      variables: {
        id: event._id,
        input: {
          private: isPrivate,
        },
      },
    });
  };

  return (
    <ModalContent
      icon={event.private ? 'icon-sparkles' : 'icon-globe'}
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        {
          event.private ? (
            <div className="space-y-1">
              <p className="text-lg">Private Event</p>
              <p className="text-secondary text-sm">This event is not listed, featured by Lemonade, or indexed by search engines. Guests are not asked to share it.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-lg">Public Event</p>
              <p className="text-secondary text-sm">This event is listed on your community hub and is eligible to be featured by Lemonade or listed by other communities.</p>
            </div>
          )
        }

        <div className="space-y-1.5">
          <p className="text-sm text-tertiary">New Visibility</p>
          <Menu.Root placement="bottom-start" className="w-full">
            <Menu.Trigger className="flex items-center gap-2.5 p-3 bg-card rounded-md border border-card-border cursor-pointer hover:bg-card-hover w-full">
              <i className={`${isPrivate ? 'icon-sparkles' : 'icon-globe'} size-5 text-tertiary`} />
              <span className="font-medium">{isPrivate ? 'Private' : 'Public'}</span>
              <i className="icon-chevron-down size-5 text-tertiary ml-auto" />
            </Menu.Trigger>
            <Menu.Content className="w-[300px] p-1">
              {({ toggle }) => (
                <>
                  <MenuItem
                    onClick={() => {
                      setIsPrivate(false);
                      toggle();
                    }}
                    iconLeft="icon-globe size-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-secondary">Public</p>
                      <p className="text-xs text-tertiary whitespace-pre-wrap">Shown on your community hub and eligible to be featured.</p>
                    </div>
                    {!isPrivate && <i className="icon-check size-4 text-primary" />}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setIsPrivate(true);
                      toggle();
                    }}
                    iconLeft="icon-sparkles size-4"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-secondary">Private</p>
                      <p className="text-xs text-tertiary whitespace-pre-wrap">Unlisted. Only people with the link can register.</p>
                    </div>
                    {isPrivate && <i className="icon-check size-4 text-primary" />}
                  </MenuItem>
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        <Button
            onClick={handleUpdateVisibility}
            loading={loading}
            className="w-full"
            variant="secondary"
          >
            Update Visibility
          </Button>
      </div>
    </ModalContent>
  );
}
