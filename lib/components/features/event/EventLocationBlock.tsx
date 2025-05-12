import { Skeleton } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { useSession } from '$lib/hooks/useSession';
import { isAttending } from '$lib/utils/event';

export function EventLocationBlock({ loading = false, event }: { loading?: boolean; event?: Event }) {
  const session = useSession();

  const attending = session?.user && event ? isAttending(event, session?.user) : false;
  
  if (loading) return <EventLocationBlockSkeleton />;

  if (event?.virtual) return (
    <div className="flex gap-4 flex-1 items-center">
      <div className="border rounded-sm size-12 min-w-12 flex items-center justify-center">
        <i className="icon-video" />
      </div>
      <p>Virtual</p>
    </div>
  );

  if (!event?.address) return null;

  return (
    <div className="flex gap-4 flex-1">
      <div className="border rounded-sm size-12 min-w-12 flex items-center justify-center">
        <i className="icon-location-outline" />
      </div>
      <div className="truncate">
        <p className="truncate text-lg">
          {attending ? (
            <>
              {event.address.title} <i className="icon-arrow-outward text-quaternary size-[18px]" />
            </>
          ) : (
            'Register to See Address'
          )}
        </p>
        <span className="text-sm">
          {[event.address?.city || event.address?.region, event.address?.country].filter(Boolean).join(', ')}
        </span>
      </div>
    </div>
  );
}

function EventLocationBlockSkeleton() {
  return (
    <div className="flex gap-4 flex-1">
      <div className="border rounded-sm size-12 text-secondary flex flex-col justify-center items-center font-medium">
        <span className="py-0.5 text-xs"></span>
      </div>
      <div className="flex flex-col justify-between">
        <Skeleton animate className="w-40 h-6" />
        <Skeleton animate className="w-24 h-4" />
      </div>
    </div>
  );
}
