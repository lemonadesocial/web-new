'use client';

import clsx from 'clsx';
import { format } from 'date-fns';

import type { AtlasTicketComparison, AtlasTicketType } from '$lib/types/atlas';

interface TicketComparePaneProps {
  comparisons: AtlasTicketComparison[];
  onSelectTicket: (eventId: string, ticketTypeId: string) => void;
}

const availabilityLabel: Record<AtlasTicketType['availability'], string> = {
  available: 'Available',
  limited: 'Limited',
  sold_out: 'Sold out',
};

const availabilityTextColor: Record<AtlasTicketType['availability'], string> = {
  available: 'text-success-500',
  limited: 'text-warning-300',
  sold_out: 'text-danger-500',
};

function findBestValue(comparisons: AtlasTicketComparison[]): { eventId: string; ticketId: string } | null {
  let best: { eventId: string; ticketId: string; price: number } | null = null;

  for (const comp of comparisons) {
    if (comp.best_value_ticket_id) {
      return { eventId: comp.event.id, ticketId: comp.best_value_ticket_id };
    }
    for (const ticket of comp.tickets) {
      if (ticket.availability !== 'sold_out' && (!best || ticket.price < best.price)) {
        best = { eventId: comp.event.id, ticketId: ticket.id, price: ticket.price };
      }
    }
  }

  return best ? { eventId: best.eventId, ticketId: best.ticketId } : null;
}

export function TicketComparePane({ comparisons, onSelectTicket }: TicketComparePaneProps) {
  const bestValue = findBestValue(comparisons);

  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-secondary text-xs font-medium">Comparing tickets across {comparisons.length} events</p>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {comparisons.map((comp) => (
          <div
            key={comp.event.id}
            className="flex flex-col gap-2 min-w-[240px] max-w-[300px] rounded-md border border-card-border bg-overlay-secondary p-3 shrink-0"
          >
            <div className="space-y-1">
              <p className="text-primary text-sm font-medium truncate">{comp.event.title}</p>
              {comp.event.start && (
                <p className="text-tertiary text-xs">
                  {format(new Date(comp.event.start), "EEE, d MMM 'at' h:mm a")}
                </p>
              )}
              <p className="text-quaternary text-[10px] capitalize">{comp.event.source_platform}</p>
            </div>

            <div className="border-t border-card-border pt-2 flex flex-col gap-1.5">
              {comp.tickets.map((ticket) => {
                const isBest =
                  bestValue?.eventId === comp.event.id && bestValue?.ticketId === ticket.id;
                const isSoldOut = ticket.availability === 'sold_out';

                return (
                  <button
                    key={ticket.id}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => onSelectTicket(comp.event.id, ticket.id)}
                    className={clsx(
                      'flex items-center justify-between p-2 rounded text-left transition-colors',
                      isSoldOut
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-accent-400/8 cursor-pointer',
                      isBest && 'ring-1 ring-accent-400',
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-secondary text-xs font-medium truncate">{ticket.name}</p>
                      <p className={clsx('text-[10px]', availabilityTextColor[ticket.availability])}>
                        {availabilityLabel[ticket.availability]}
                        {ticket.quantity_remaining != null && !isSoldOut && (
                          <span className="text-quaternary"> ({ticket.quantity_remaining} left)</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <p className="text-primary text-sm font-medium">
                        {ticket.price === 0 ? 'Free' : `${ticket.currency} ${ticket.price.toFixed(2)}`}
                      </p>
                      {isBest && (
                        <span className="text-accent-400 text-[10px] font-medium">Best value</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {bestValue && (
        <div className="flex items-center gap-1.5 pt-1">
          <i aria-hidden="true" className="icon-star size-3.5 text-accent-400" />
          <span className="text-tertiary text-xs">Best value option highlighted above</span>
        </div>
      )}
    </div>
  );
}
