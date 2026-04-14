import { Divider, drawer } from '$lib/components/core';
import { Event, GetEventsDocument } from '$lib/graphql/generated/backend/graphql';
import React from 'react';
import { EventListCard } from '../EventList';
import { useQuery } from '$lib/graphql/request';
import { EventPane } from '../pane';

export function SubEventSection({ 
  event, 
  title = 'Schedule' 
}: { 
  event?: Event; 
  title?: string;
}) {
  const [inView, setInView] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const { data, loading } = useQuery(GetEventsDocument, {
    variables: { skip: 0, limit: 20, subeventParent: event?._id },
    skip: !event?._id || !inView,
  });

  const events = (data?.getEvents || []) as Event[];
  
  if (!event?.subevent_enabled) return null;
  if (!loading && !events.length && inView) return null;

  return (
    <div ref={containerRef} className="flex flex-col gap-2 w-full min-h-[100px]">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{title}</h3>
        {events.length > 0 && (
          <p className="text-secondary text-sm">{events.length} sessions</p>
        )}
      </div>
      <Divider className="h-1 w-full mb-2" />
      <EventListCard 
        events={events} 
        loading={loading && inView}
        onSelect={(event) => drawer.open(EventPane, { props: { eventId: event._id }, contentClass: 'bg-background' })} 
      />
    </div>
  );
}
