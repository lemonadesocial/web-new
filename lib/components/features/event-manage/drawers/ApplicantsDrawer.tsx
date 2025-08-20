import { Button, drawer } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';

import { PendingApprovalList } from '../common/PendingApprovalList';

interface ApplicantsDrawerProps {
  event: Event;
}

export function ApplicantsDrawer({ event }: ApplicantsDrawerProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex flex-shrink-0">
        <Button
          icon="icon-chevron-double-right"
          variant="tertiary"
          size="sm"
          onClick={() => drawer.close()}
        />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        <div>
          <h1 className="text-xl font-semibold">Pending Approval</h1>
          <p className="text-secondary">Review and manage guest requests to join {event.title}.</p>
        </div>
        <PendingApprovalList event={event} />
      </div>
    </div>
  );
}
