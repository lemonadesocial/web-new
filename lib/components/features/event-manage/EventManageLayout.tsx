'use client';

import NextLink from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useState, useRef } from 'react';

import { Event, PublishEventDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, drawer, toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';

import { eventAtom, useUpdateEvent } from './store';
import { EditEventDrawer } from './drawers/EditEventDrawer';

const eventManageMenu = [
  { name: 'Overview', page: 'overview' },
  { name: 'Guests', page: 'guests' },
  { name: 'Registration', page: 'registration' },
  { name: 'Blasts', page: 'blasts' },
  // { name: 'Program', page: 'program' },
  // { name: 'Insights', page: 'insights' },
  // { name: 'More', page: 'more' },
];

export function EventManageLayout({ children, event: initEvent }: React.PropsWithChildren & { event: Event }) {
  const pathname = usePathname();
  const params = useParams<{ shortid: string }>();
  const shortid = params.shortid;
  const [isScrolled, setIsScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [event, setEvent] = useAtom(eventAtom);
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
    setEvent(initEvent);
  }, [initEvent, setEvent]);

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

  if (!event) return null;

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
