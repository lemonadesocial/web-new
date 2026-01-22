'use client';
import { useAtom } from 'jotai';

import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, Skeleton } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';

import { eventAtom } from './store';

interface EventProtectedProps {
  shortid: string;
  loadingFallback?: React.ReactNode;
  gate?: (event: Event, userId: string | undefined) => boolean;
  children: (event: Event) => React.ReactNode;
}

export function EventProtected({
  shortid,
  loadingFallback,
  gate,
  children,
}: EventProtectedProps) {

  const [event, setEvent] = useAtom(eventAtom);
  const me = useMe();

  const { loading } = useQuery(GetEventDocument, {
    variables: { shortid },
    onComplete(data) {
      setEvent(data?.getEvent as Event);
    },
  });

  if (loading) {
    if (loadingFallback) return <>{loadingFallback}</>;

    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2 overflow-auto no-scrollbar">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-32 rounded-md" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-md" />
            <Skeleton className="h-80 rounded-md" />
          </div>
          <Skeleton className="h-32 rounded-md" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-alert-outline size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Event Not Found</h1>
            <p className="text-secondary">The event you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button variant="tertiary" onClick={() => (window.location.href = '/')} iconLeft="icon-home">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const hasAccess = gate ? gate(event, me?._id) : event.me_is_host;

  if (!hasAccess) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-lock size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">No Access</h1>
            <p className="text-secondary">You don't have access to manage this event.</p>
          </div>
          <Button
            variant="tertiary"
            onClick={() => (window.location.href = `/e/${shortid}`)}
            iconRight="icon-chevron-right"
          >
            Event Page
          </Button>
        </div>
      </div>
    );
  }

  return <>{children(event, loading)}</>;
}

