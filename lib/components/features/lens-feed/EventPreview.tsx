import { Event } from "$lib/graphql/generated/backend/graphql";
import { getEventHosts } from "$lib/utils/event";

export function EventPreview({ event }: { event: Event }) {

  if (!event?._id) return null; // fallback to old metadata

  const hosts = getEventHosts(event);

  return (
    <div className="flex flex-col gap-3">
      <img
        src={`${process.env.NEXT_PUBLIC_HOST_URL}/api/og/event/${event.shortid}`}
        alt="Post attachment"
        className="rounded-sm object-cover border border-card-border h-full w-full aspect-video cursor-pointer"
        onClick={() => window.open(event.url!, '_blank')}
      />
      <p className="text-sm text-secondary">
        Hosted By{' '}
        {hosts
          .map((p) => p?.name)
          .join(', ')
          .replace(/,(?=[^,]*$)/, ' & ')}
      </p>
    </div>
  );
}
