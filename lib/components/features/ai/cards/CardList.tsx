'use client';

import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';

import { Button } from '$lib/components/core';
import { EventCard } from './EventCard';
import { TicketCard } from './TicketCard';
import { SpaceCard } from './SpaceCard';
import { GuestRow } from './GuestRow';
import type { CardItem, OverflowData } from './utils';

interface CardListProps {
  cards: CardItem[];
  overflow?: OverflowData;
}

export function CardList({ cards, overflow }: CardListProps) {
  const router = useRouter();
  if (!cards || cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {cards.map((card, idx) =>
        match(card)
          .with({ type: 'event' }, (c) => (
            <EventCard key={idx} data={c.data} link={c.link} />
          ))
          .with({ type: 'ticket' }, (c) => (
            <TicketCard key={idx} data={c.data} link={c.link} />
          ))
          .with({ type: 'space' }, (c) => (
            <SpaceCard key={idx} data={c.data} link={c.link} />
          ))
          .with({ type: 'guest' }, (c) => (
            <GuestRow key={idx} data={c.data} />
          ))
          .exhaustive(),
      )}
      {overflow?.viewAllLink && (
        <Button
          variant="tertiary"
          size="sm"
          iconRight="icon-chevron-right"
          className="w-fit"
          onClick={() => router.push(overflow.viewAllLink)}
        >
          {overflow.viewAllLabel}
        </Button>
      )}
    </div>
  );
}
