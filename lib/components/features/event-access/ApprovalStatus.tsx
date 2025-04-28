import { EventJoinRequest, EventJoinRequestState } from '$lib/graphql/generated/backend/graphql';
import { AccessCard } from './AccessCard';
import { useMemo } from 'react';

export function ApprovalStatus({ joinRequest }: { joinRequest: EventJoinRequest }) {
  const ticketTypeText = useMemo(() => {
    if (joinRequest.state === EventJoinRequestState.Declined) return '';

    if (!joinRequest.requested_tickets?.length) return '';

    return joinRequest.requested_tickets
      .map(ticket => {
        const ticketType = joinRequest.ticket_types_expanded?.find(t => t?._id === ticket.ticket_type);
        return `${ticket.count}x ${ticketType?.title || ''}`;
      })
      .join(', ');
  }, [joinRequest]);

  return (
    <AccessCard>
      <div>
        {joinRequest.state === EventJoinRequestState.Pending && (
          <>
            <h3 className="text-xl font-semibold">Pending Approval</h3>
            <p className="text-lg text-tertiary">{ticketTypeText}</p>
            <p className="text-secondary">We will let you know when the host approves your registration.</p>
          </>
        )}
        {joinRequest.state === EventJoinRequestState.Declined && (
          <>
            <h3 className="text-xl font-semibold">Request Denied</h3>
            <p className="text-secondary">The host has denied your request to join this event.</p>
          </>
        )}
      </div>
    </AccessCard>
  );
}
