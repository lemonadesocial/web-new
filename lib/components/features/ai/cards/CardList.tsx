'use client';

import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';

import { Button } from '$lib/components/core';
import { EventCard } from './EventCard';
import { TicketCard } from './TicketCard';
import { SpaceCard } from './SpaceCard';
import { GuestRow } from './GuestRow';
import { AtlasEventCard } from './AtlasEventCard';
import { PaymentLinkCard } from './PaymentLinkCard';
import { AtlasReceiptCard } from './AtlasReceiptCard';
import { TicketComparePane } from '../panes/TicketComparePane';
import type { CardItem, OverflowData } from './utils';

interface CardListProps {
  cards: CardItem[];
  overflow?: OverflowData;
}

export function CardList({ cards, overflow }: CardListProps) {
  const router = useRouter();
  if (!cards || cards.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
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
          .with({ type: 'atlas_event' }, (c) => (
            <AtlasEventCard key={idx} event={c.data} />
          ))
          .with({ type: 'atlas_comparison' }, (c) => (
            <TicketComparePane key={idx} comparisons={c.data} onSelectTicket={() => {}} />
          ))
          .with({ type: 'atlas_payment_link' }, (c) => (
            <PaymentLinkCard key={idx} checkout={c.data} />
          ))
          .with({ type: 'atlas_receipt' }, (c) => (
            <AtlasReceiptCard key={idx} receipt={c.data} />
          ))
          .otherwise(() => null),
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
