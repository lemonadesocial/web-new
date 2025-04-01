import { Event } from '$lib/generated/backend/graphql';
import { attending } from '$lib/utils/event';

import { useSession } from '$lib/hooks/useSession';
import { MyTickets } from './MyTickets';


export function EventAccess({ event }: { event: Event }) {
  const session = useSession();
  const isAttending = attending(event, session?.user);

  if (isAttending) return <MyTickets event={event} />;
  return <div>Event Access</div>;
}
