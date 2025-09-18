import { Button, drawer } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { Event } from '$lib/graphql/generated/backend/graphql';

import { PendingApprovalList } from '../common/PendingApprovalList';

interface ApplicantsDrawerProps {
  event: Event;
}

export function ApplicantsDrawer({ event }: ApplicantsDrawerProps) {
  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton />
      </Pane.Header.Root>
      <Pane.Content className="p-4 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Pending Approval</h1>
          <p className="text-secondary">Review and manage guest requests to join {event.title}.</p>
        </div>
        <PendingApprovalList event={event} />
      </Pane.Content>
    </Pane.Root>
  );
}
