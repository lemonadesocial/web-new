import { hasSingleFreeTicketAtom, ticketLimitAtom, ticketTypesAtom, useAtomValue } from "./store";
import { TicketSelectItem } from "./TicketSelectItem";

export function TicketSelect() {
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);

  if (hasSingleFreeTicket && ticketLimit === 1) return null;

  if (ticketTypes.length === 1) return <TicketSelectItem ticketType={ticketTypes[0]} />;

  return <div>
    hello
  </div>;
}
