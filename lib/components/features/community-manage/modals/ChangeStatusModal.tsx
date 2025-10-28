'use client';
import React from 'react';
import { Button, Card, modal, ModalContent, toast } from '$lib/components/core';
import { Space, SpaceState, UpdateSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const cards = [
  {
    key: SpaceState.Active,
    title: 'Active',
    subtitle: 'Make the community active and accept subscriptions & event submissions.',
    icon: 'icon-calendar-check-outline',
  },
  {
    key: SpaceState.Archived,
    title: 'Archived',
    subtitle: 'Archive the community and stop people from subscribing or submitting events.',
    icon: 'icon-archive',
  },
];

export function ChangeStatusModal({ space }: { space: Space }) {
  const [selected, setSelected] = React.useState(space.state);
  const [update, { loading }] = useMutation(UpdateSpaceDocument, {
    onComplete: (client, incoming) => {
      toast.success('Update success.');
      if (space) client.writeFragment({ id: `Space:${space._id}`, data: { ...space, ...incoming.updateSpace } });
      modal.close();
    },
  });

  const handleUpdate = async (input: Partial<Space>) => {
    await update({ variables: { id: space._id, input } });
  };

  return (
    <ModalContent icon="icon-calendar" onClose={() => modal.close()} className="w-full max-w-sm md:max-w-[330px]">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Change Status</p>
          <p className="text-sm text-tertiary">Choose the desired status for the community.</p>
        </div>

        <div className="space-y-2">
          {cards.map((card) => (
            <Card.Root
              key={card.key}
              className={clsx(card.key === selected && 'border-primary')}
              onClick={() => setSelected(card.key)}
            >
              <Card.Content className="py-1.5 px-3 flex gap-3 items-center">
                <i
                  className={twMerge(
                    'size-5 aspect-square',
                    clsx(card.key === selected ? 'icon-check-filled' : card.icon),
                  )}
                />
                <div>
                  <p>{card.title}</p>
                  <p>{card.subtitle}</p>
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>

        <Button variant="secondary" loading={loading} onClick={() => handleUpdate({ state: selected })}>
          Update Status
        </Button>
      </div>
    </ModalContent>
  );
}
