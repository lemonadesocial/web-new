'use client';

import NextLink from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import clsx from 'clsx';
import { useSetAtom } from 'jotai';
import { useEffect, useState, useRef } from 'react';

import { Event, PublishEventDocument, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, drawer, toast, Skeleton } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';

import { eventAtom, useUpdateEvent } from './store';
import { EditEventDrawer } from './drawers/EditEventDrawer';
import { useMe } from '$lib/hooks/useMe';
import { hosting } from '$lib/utils/event';

const eventManageMenu = [
  { name: 'Overview', page: 'overview' },
  { name: 'Guests', page: 'guests' },
  { name: 'Registration', page: 'registration' },
  { name: 'Blasts', page: 'blasts' },
  // { name: 'Program', page: 'program' },
  // { name: 'Insights', page: 'insights' },
  // { name: 'More', page: 'more' },
];

export function EventManageLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const params = useParams<{ shortid: string }>();
  const shortid = params.shortid;
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const me = useMe();

  const { data, loading, error } = useQuery(GetEventDocument, { variables: { shortid } });
  const event = data?.getEvent as Event;

  const setEventState = useSetAtom(eventAtom);
  const updateEvent = useUpdateEvent();

  const [publishEvent, { loading: publishing }] = useMutation(PublishEventDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent?.published) {
        toast.success('Event published successfully!');
        updateEvent({ published: true });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to publish event');
    },
  });

  useEffect(() => {
    if (event) {
      setEventState(event);
    }
  }, [event, setEventState]);

  useEffect(() => {
    const setupObserver = () => {
      if (!sentinelRef.current) {
        requestAnimationFrame(setupObserver);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setIsScrolled(!entry.isIntersecting);
        });
      });

      observer.observe(sentinelRef.current);

      return observer;
    };

    const observer = setupObserver();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const handlePublish = () => {
    if (!event?._id) return;

    publishEvent({
      variables: {
        event: event._id,
      },
    });
  };

  if (loading) {
    return (
      <div>
        <div className="sticky top-0 backdrop-blur-md transition-all duration-300 z-1 pt-7">
          <div className="page mx-auto px-4 md:px-0">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
              {eventManageMenu.map((item) => (
                <Skeleton key={item.page} className="h-6 w-20" />
              ))}
            </nav>
          </div>
        </div>
        <div className="page mx-auto py-7 px-4 md:px-0">
          <div className="space-y-6">
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
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-alert-outline size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Event Not Found</h1>
            <p className="text-secondary">
              The event you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            variant="tertiary"
            onClick={() => window.location.href = '/'}
            iconLeft="icon-home"
          >
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const isHost = me?._id && event && hosting(event, me._id);
  
  if (!isHost) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-lock size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">No Access</h1>
            <p className="text-secondary">
              You don't have access to manage this event.
            </p>
          </div>
          <Button
            variant="tertiary"
            onClick={() => window.location.href = `/e/${shortid}`}
            iconRight="icon-chevron-right"
          >
            Event Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div ref={sentinelRef} />
      {/* <div className={clsx("sticky top-0 backdrop-blur-md transition-all duration-300 z-1", isScrolled ? "pt-2" : "pt-7")}> */}
      <div className={clsx('sticky top-0 backdrop-blur-md transition-all duration-300 z-1 pt-7')}>
        <div className="page mx-auto px-4 md:px-0">
          <div className="flex justify-between items-center">
            {/* <h1 className={clsx("font-semibold transition-all duration-300", isScrolled ? "text-lg font-body" : "text-2xl")}>{event.title}</h1> */}
            <h1 className={clsx('font-semibold transition-all duration-300 text-2xl')}>{event.title}</h1>
            <div className="flex gap-2">
              {event.published ? (
                <Button
                  variant="tertiary-alt"
                  size="sm"
                  onClick={() => drawer.open(EditEventDrawer, { props: { event }, dismissible: false })}
                  iconRight="icon-edit-sharp"
                >
                  Published
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={handlePublish} loading={publishing}>
                  Publish
                </Button>
              )}
              <Button
                iconRight="icon-arrow-outward"
                variant="tertiary-alt"
                size="sm"
                onClick={() => window.open(`/e/${shortid}`, '_blank')}
              >
                Event Page
              </Button>
            </div>
          </div>
          <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
            {eventManageMenu.map((item) => {
              const url = `/e/manage/${shortid}/${item.page}`;
              const isActive = item.page === 'overview' 
                ? pathname === `/e/manage/${shortid}` || pathname === url
                : pathname === url;

              return (
                <NextLink
                  href={url}
                  key={item.page}
                  className={clsx(isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
                >
                  <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>{item.name}</span>
                </NextLink>
              );
            })}
          </nav>
        </div>
        <hr className="w-screen -mx-[50vw] ml-[calc(-50vw+50%)] border-t border-t-divider" />
      </div>
      <div className="page mx-auto py-7 px-4 md:px-0">{children}</div>
    </div>
  );
}
