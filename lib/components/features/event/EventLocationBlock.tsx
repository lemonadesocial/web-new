import { Skeleton } from '$lib/components/core';
import { Event } from '$lib/generated/backend/graphql';
import { useSession } from '$lib/hooks/useSession';
import { isAttending } from '$lib/utils/event';

export function EventLocationBlock({ loading = false, event }: { loading?: boolean; event?: Event }) {
  const session = useSession();

  if (loading) return <EventLocationBlockSkeleton />;
  if (!event?.address) return null;

  const attending = session?.user ? isAttending(event, session?.user) : false;

  return (
    <div className="flex gap-4 flex-1 text-nowrap">
      <div className="border rounded-sm size-12 flex items-center justify-center">
        <i className="icon-location-outline" />
      </div>
      {attending ? (
        <div>
          <p>
            {event.address?.title} <i className="icon-arrow-outward text-quaternary size-[18px]" />
          </p>
          <p className="text-sm">
            {[event.address?.city || event.address?.region, event.address?.country].filter(Boolean).join(', ')}
          </p>
        </div>
      ) : (
        <div className="flex items-center text-lg">To Be Announced</div>
      )}
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
