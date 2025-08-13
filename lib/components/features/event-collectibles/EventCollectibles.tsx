import { Event, PoapDrop } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { ListPoapDropsDocument } from "$lib/graphql/generated/backend/graphql";

import { CollectibleCard } from "./CollectibleCard";

export function EventCollectibles({ event }: { event: Event }) {
  const { data: poapDropsData } = useQuery(ListPoapDropsDocument, {
    variables: { event: event._id }
  });

  const poapDrops = poapDropsData?.listPoapDrops || [];
  const gridCols = poapDrops.length <= 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">Collectibles</p>
      <hr className="border-t border-divider" />
      <div className={`grid ${gridCols} gap-3`}>
        {poapDrops.map((poapDrop) => (
          <CollectibleCard
            key={poapDrop._id}
            poapDrop={poapDrop}
            eventId={event._id}
          />
        ))}
      </div>
    </div>
  );
}
