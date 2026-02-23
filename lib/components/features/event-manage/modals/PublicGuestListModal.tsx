import { Button, Card, modal, toast } from '$lib/components/core';
import { Event, UpdateEventToggleAttendingDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useUpdateEvent } from '../store';

export function PublicGuestListModal({ event }: { event: Event }) {
  const updateEvent = useUpdateEvent();
  const [update, { loading }] = useMutation(UpdateEventToggleAttendingDocument, {
    onComplete: (_, res) => {
      updateEvent({ hide_attending: res.updateEvent.hide_attending });
      toast.success('Updated!');
      modal.close();
    },
  });

  return (
    <Card.Root className="*:bg-overlay-primary border-none w-[340px]">
      <Card.Header className="flex justify-between items-start">
        <div className="rounded-full bg-(--btn-tertiary) text-tertiary flex items-center justify-center size-14">
          <i aria-hidden="true" className="size-8 icon-user-group-outline" />
        </div>
      </Card.Header>

      <Card.Content>
        <div className="flex flex-col gap-2 mb-4">
          <p className="text-lg">Public Guest List</p>
          <p className="text-sm text-secondary">Display the guest count and a few guests on the event page.</p>
          <p className="text-sm text-secondary">
            Even when it is turned on, only registered guests can access the full list.
          </p>
        </div>

        <Button
          variant="secondary"
          className="w-full"
          loading={loading}
          onClick={() => update({ variables: { id: event._id, input: { hide_attending: !event.hide_attending } } })}
        >
          {!event.hide_attending ? 'Hide Guest List' : 'Show Guest List'}
        </Button>
      </Card.Content>
    </Card.Root>
  );
}
