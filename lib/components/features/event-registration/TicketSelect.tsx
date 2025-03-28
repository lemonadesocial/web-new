import { Collapsible } from "$lib/components/core";
import { GroupedTicketTypes, groupTicketTypesByCategory } from "$lib/utils/event";
import { useMemo } from "react";
import { hasSingleFreeTicketAtom, ticketLimitAtom, ticketTypesAtom, useAtomValue } from "./store";
import { TicketSelectItem } from "./TicketSelectItem";
import { PurchasableTicketType } from "$lib/generated/backend/graphql";

export function TicketSelect() {
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);
  const groupedTicketTypes = useMemo(() => groupTicketTypesByCategory(ticketTypes), [ticketTypes]);

  if (hasSingleFreeTicket && ticketLimit === 1) return null;

  if (ticketTypes.length === 1) return <TicketSelectItem ticketType={ticketTypes[0]} single />;

  if (groupedTicketTypes.length > 1) {
    return groupedTicketTypes.map((group, index) => <TicketCategory key={index} category={group.category} ticketTypes={group.ticketTypes} />);
  }

  return <TicketList ticketTypes={ticketTypes} />;
}

function TicketCategory({ category, ticketTypes }: GroupedTicketTypes) {
  if (ticketTypes.length === 1) return <TicketSelectItem ticketType={ticketTypes[0]} />;

  return (
    <Collapsible
      header={
        <div className='flex gap-3'>
          <i className="icon-folder text-tertiary/80" />
          <div>
            {category?.title || 'Uncategorized'}
          </div>
        </div>
      }
    >
      <TicketList ticketTypes={ticketTypes} />
    </Collapsible>
  );
}

function TicketList({ ticketTypes }: { ticketTypes: PurchasableTicketType[] }) {
  return (
    <div className="flex flex-col gap-2">
      {ticketTypes.map((ticketType) => <TicketSelectItem key={ticketType._id} ticketType={ticketType} />)}
    </div>
  );
}
