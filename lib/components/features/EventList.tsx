import React from 'react';
import { groupBy } from 'lodash';
import { format } from 'date-fns';

import { Address, Event } from '$lib/generated/graphql';
import { Card, Spacer } from '$lib/components/core';
import { generateUrl } from '$lib/utils/cnd';

function EventLoadingSkeleton() {
  return (
    <div className="flex flex-col">
      {Object.entries({ 1: [{ _id: 1 }, { _id: 2 }], 2: [] }).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-l border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
            <div className="size-2 bg-background -ml-[5px] absolute">
              <div className="size-2 rounded-full bg-tertiary/[.24] " />
            </div>
          </div>

          <div className="ml-5">
            <div className="h-4.5 bg-tertiary/[.08] mt-1 rounded-xs w-30"></div>
            <Spacer className="h-3" />

            <div className="flex flex-col gap-3">
              {data.map((item) => (
                <div key={`event_${item._id}`}>
                  <Card>
                    <div className="flex gap-5">
                      <div className="text-tertiary/[.56] flex-1">
                        <div className="flex gap-2 font-medium">
                          <div className="flex gap-2 items-center">
                            <div className="size-1.5 bg-danger-400 rounded-full" />
                            <span className="text-danger-400 uppercase">Live</span>
                            <div className="size-0.5 bg-tertiary/[.24] rounded-full" />
                          </div>
                          <div className="size-2 rounded-full bg-tertiary/[.24] rounded-xs" />
                        </div>
                        <div className="h-5 bg-tertiary/[0.08] w-44 rounded-xs"></div>
                        <div className="flex flex-col gap-1">
                          <div className="inline-flex items-center gap-2">
                            <i className="icon-location-outline size-4" />
                            <div className="h-4.5 bg-tertiary/[.08] rounded-xs w-24"></div>
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <i className="icon-user-group-outline size-4" />
                            <div className="h-4.5 bg-tertiary/[.08] rounded-xs w-30 "></div>
                          </div>
                        </div>
                      </div>
                      <div className="size-[120px] bg-tertiary/[.08] rounded-lg" />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Spacer className="h-6" />
        </div>
      ))}
    </div>
  );
}

export function EventList({ events, loading }: { events: Event[]; loading?: boolean }) {
  const getLocattion = (address?: Address | null) => {
    let location = '';
    if (address?.city) location += address.city + ', ';
    if (address?.country) location += address.country;
    else location = 'Unknow';

    return location;
  };

  if (loading) return <EventLoadingSkeleton />;

  return (
    <div className="flex flex-col">
      {Object.entries(groupBy(events, ({ start }) => start)).map(([date, data]) => (
        <div className="flex flex-col relative" key={date}>
          <div className="border-l border-dashed border-l-2 absolute h-full left-1 top-2 z-10">
            <div className="size-2 bg-background -ml-[5px] absolute">
              <div className="size-2 rounded-full bg-tertiary/[.24] " />
            </div>
          </div>

          <div className="ml-5">
            <p className="text-md text-tertiary/[.56] font-medium">
              <span className="text-tertiary">{format(new Date(date), 'MMM dd ')}</span>{' '}
              {format(new Date(date), 'EEEE')}
            </p>
            <Spacer className="h-3" />

            <div className="flex flex-col gap-3">
              {data.map((item) => (
                <div key={`event_${item._id}`}>
                  <Card>
                    <div className="flex">
                      <div className="text-tertiary/[.56] flex-1">
                        <div className="flex gap-2 font-medium">
                          <div className="flex gap-2 items-center">
                            <div className="size-1.5 bg-danger-400 rounded-full" />
                            <span className="text-danger-400 uppercase">Live</span>
                            <div className="size-0.5 bg-tertiary/[.24] rounded-full" />
                          </div>
                          <p>{format(item.start, 'hh:mm a')}</p>
                        </div>
                        <p className="font-title text-xl font-semibold text-tertiary">{item.title}</p>
                        <div className="flex flex-col gap-1">
                          <div className="inline-flex items-center gap-2">
                            <i className="icon-location-outline size-4" />
                            <span className="text-md">{getLocattion(item.address)}</span>
                          </div>
                          <div className="inline-flex items-center gap-2">
                            <i className="icon-user-group-outline size-4" />
                          </div>
                        </div>
                      </div>
                      {!!item?.new_new_photos_expanded?.[0] && (
                        <img
                          className="aspect-square object-contain rounded-lg w-[120px] h-[120px]"
                          src={generateUrl(item?.new_new_photos_expanded[0], {
                            resize: { height: 120, width: 120, fit: 'cover' },
                          })}
                          alt={item.title}
                        />
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Spacer className="h-6" />
        </div>
      ))}
    </div>
  );
}
