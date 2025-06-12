'use client';

import NextLink from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { Event } from '$lib/graphql/generated/backend/graphql';
import { Button } from '$lib/components/core';

import { eventAtom } from './store';

const eventManageMenu = [
  { name: 'Overview', page: 'overview' },
  { name: 'Guests', page: 'guests' },
  { name: 'Registration', page: 'registration' },
  { name: 'Blasts', page: 'blasts' },
  { name: 'Program', page: 'program' },
  { name: 'Insights', page: 'insights' },
  { name: 'More', page: 'more' },
];

export function EventManageLayout({ children, event: initEvent }: React.PropsWithChildren & { event: Event }) {
  const pathname = usePathname();
  const params = useParams<{ shortid: string }>();
  const shortid = params.shortid;

  const [event, setEvent] = useAtom(eventAtom);

  useEffect(() => {
    setEvent(initEvent);
  }, [initEvent, setEvent]);

  if (!event) return null;

  return (
    <div>
      <div className="sticky top-0 backdrop-blur-md pt-7">
        <div className="page mx-auto px-4 md:px-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">{event.title}</h1>
            <div className="flex gap-2">
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
          <nav className="flex gap-4 pt-1">
            {eventManageMenu.map(item => {
              const url = `/e/manage/${shortid}/${item.page}`;
              const isActive = pathname === url;

              return (
                <NextLink
                  href={url}
                  key={item.page}
                  className={clsx(isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
                >
                  <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                    {item.name}
                  </span>
                </NextLink>
              )
            })}
          </nav>
        </div>
        <hr className="w-screen -mx-[50vw] ml-[calc(-50vw+50%)] border-t border-t-divider" />
      </div>
      <div className="page mx-auto pt-7 px-4 md:px-0">
        {children}
      </div>
    </div>);
}
