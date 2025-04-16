import { generateUrl } from "$lib/utils/cnd";
import type { Space } from "$lib/generated/backend/graphql";

import { Button } from "$lib/components/core";
import { Card } from "$lib/components/core";


interface CommunityCardProps {
  space?: Space;
}

const CommunityCard = ({ space }: CommunityCardProps) => {
  return (
    <Card.Root as="link" href={`/c/${space?.slug}`} className="flex flex-col gap-y-6">

      <div className="flex justify-between">
        <div className="w-12 h-12 rounded-sm bg-quaternary overflow-hidden">
          <img src={generateUrl(space?.image_avatar_expanded, {
            resize: { width: 96, fit: 'contain' },
          })} alt={space?.title} className="w-full h-full object-cover" />
        </div>
        <Button variant="tertiary-alt" size="sm">
          Subscribe
        </Button>
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-xl font-semibold">{space?.title}</h3>
        {space?.description && <p className="text-md text-tertiary line-clamp-2">{space.description}</p>}
      </div>
    </Card.Root>
  );
};

export default CommunityCard;
