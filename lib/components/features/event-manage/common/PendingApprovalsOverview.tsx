
import { Button, drawer } from '$lib/components/core';
import { Event, EventJoinRequestState, GetEventJoinRequestsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApplicantsDrawer } from '../drawers/ApplicantsDrawer';
import { PendingApprovalList } from './PendingApprovalList';

interface PendingApprovalsOverviewProps {
  event: Event;
  titleClassName?: string;
}

export function PendingApprovalsOverview({ event, titleClassName }: PendingApprovalsOverviewProps) {
  const { data } = useQuery(GetEventJoinRequestsDocument, {
    variables: {
      event: event._id,
      state: EventJoinRequestState.Pending,
      skip: 0,
      limit: 3,
    },
  });

  if (!data?.getEventJoinRequests.records.length) return;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className={twMerge(clsx('text-xl font-semibold', titleClassName))}>
          {data?.getEventJoinRequests.total} Pending Approval{data?.getEventJoinRequests.total !== 1 ? 's' : ''}
        </h2>
        <Button
          variant="tertiary"
          iconRight="icon-chevron-right"
          size="sm"
          onClick={() => drawer.open(ApplicantsDrawer, { props: { event }, contentClass: "max-w-[784px]" })}
        >
          All Applicants
        </Button>
      </div>
      
      <PendingApprovalList event={event} />
    </div>
  );
}
