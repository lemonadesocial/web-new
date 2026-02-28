'use client';

import Link from 'next/link';
import { match } from 'ts-pattern';
import { EventCard } from './EventCard';
import { TicketCard } from './TicketCard';
import { SpaceCard } from './SpaceCard';
import { GuestRow } from './GuestRow';
import type {
  CardItem,
  OverflowData,
  EventCardData,
  TicketCardData,
  SpaceCardData,
  GuestCardData,
} from './utils';

interface CardListProps {
  cards: CardItem[];
  overflow?: OverflowData;
}

export function CardList({ cards, overflow }: CardListProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      {cards.map((card, idx) =>
        match(card.type)
          .with('event', () => (
            <EventCard
              key={idx}
              data={card.data as EventCardData}
              link={card.link}
            />
          ))
          .with('ticket', () => (
            <TicketCard
              key={idx}
              data={card.data as TicketCardData}
              link={card.link}
            />
          ))
          .with('space', () => (
            <SpaceCard
              key={idx}
              data={card.data as SpaceCardData}
              link={card.link}
            />
          ))
          .with('guest', () => (
            <GuestRow key={idx} data={card.data as GuestCardData} />
          ))
          .exhaustive(),
      )}
      {overflow?.viewAllLink && (
        <Link
          href={overflow.viewAllLink}
          className="text-sm text-primary hover:underline mt-1"
        >
          {overflow.viewAllLabel} &rarr;
        </Link>
      )}
    </div>
  );
}
