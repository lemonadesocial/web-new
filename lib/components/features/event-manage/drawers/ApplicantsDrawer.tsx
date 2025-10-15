import { useEffect, useRef, useState } from 'react';

import { Skeleton } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { Event, EventJoinRequestState, GetEventJoinRequestsDocument, GetEventJoinRequestsQuery } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';

import { PendingApprovalList } from '../common/PendingApprovalList';

interface ApplicantsDrawerProps {
  event: Event;
}

export function ApplicantsDrawer({ event }: ApplicantsDrawerProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data, refetch, loading, fetchMore } = useQuery(GetEventJoinRequestsDocument, {
    variables: {
      event: event._id,
      state: EventJoinRequestState.Pending,
      skip: 0,
      limit: 20,
    },
  });

  const pendingRequests = data?.getEventJoinRequests.records || [];
  const totalCount = data?.getEventJoinRequests.total || 0;
  const hasMore = pendingRequests.length < totalCount;

  const loadMoreRequests = async () => {
    if (isLoadingMore || !hasMore || !fetchMore) return;

    setIsLoadingMore(true);

    try {
      await fetchMore({
        variables: {
          skip: pendingRequests.length,
          limit: 20,
        },
        updateQuery: (existing: GetEventJoinRequestsQuery, newData: GetEventJoinRequestsQuery) => {
          return {
            ...existing,
            getEventJoinRequests: {
              ...existing.getEventJoinRequests,
              records: [
                ...existing.getEventJoinRequests.records,
                ...newData.getEventJoinRequests.records,
              ],
            },
          };
        },
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || isLoadingMore || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      if (isNearBottom) {
        loadMoreRequests();
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, [isLoadingMore, hasMore, pendingRequests.length]);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton />
      </Pane.Header.Root>
      <Pane.Content className="overflow-y-auto">
        <div ref={contentRef} className="h-full p-4 space-y-4 overflow-y-auto">
          <div>
            <h1 className="text-xl font-semibold">Pending Approval</h1>
            <p className="text-secondary">Review and manage guest requests to join {event.title}.</p>
          </div>
            <div>
              {loading && pendingRequests.length === 0 ? (
               <div className="rounded-md border border-card-border bg-card">
                 <div className="divide-y divide-(--color-divider)">
                   {Array.from({ length: 3 }).map((_, index) => (
                     <div key={index} className="flex items-center gap-3 py-3 px-4">
                       <Skeleton className="size-9 rounded-full" />
                       <div className="flex-1 space-y-2">
                         <Skeleton className="h-4 w-32" />
                         <Skeleton className="h-3 w-24" />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             ) : (
               <>
                 <PendingApprovalList
                   pendingRequests={pendingRequests}
                   eventId={event._id}
                   onRefetch={handleRefetch}
                 />
                 {isLoadingMore && (
                   <div className="flex items-center gap-3 py-3 px-4">
                     <Skeleton className="size-9 rounded-full" />
                     <div className="flex-1 space-y-2">
                       <Skeleton className="h-4 w-32" />
                       <Skeleton className="h-3 w-24" />
                     </div>
                   </div>
                 )}
               </>
             )}
           </div>
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}
