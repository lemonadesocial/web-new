import { Button, Card, drawer } from "$lib/components/core";
import { Space } from "$lib/generated/backend/graphql";
import { generateUrl } from "$lib/utils/cnd";

const CommunityPane = ({ subSpaces }: { subSpaces: Space[]; }) => {
  return (
    <div>
      <div className="p-2 border-b sticky top-0 z-50 backdrop-blur-xl">
        <Button icon="icon-chevron-double-right" variant="tertiary-alt" size="sm" onClick={() => drawer.close()} />
      </div>
      <div className="flex flex-col p-4 gap-y-6">
        <div>
          <h2 className="text-xl font-semibold">Hubs</h2>
          <p className="text-md font-medium text-secondary">A closer look at all the hubs linked to this community. Discover new events, people, and ideas.</p>
        </div>
        <div className="flex flex-col gap-y-3">
          {subSpaces.map((space) => (
            <HubCard key={space._id} space={space} />
          ))}
        </div>
      </div>
    </div>
  );
};

const HubCard = ({ space }: { space: Space; }) => {
  return (
    <Card.Root as="link" href={`/c/${space?.slug}`} target="_blank" className="flex gap-x-3 items-center px-4 py-3">
      <div className="w-12 h-12 rounded-sm bg-quaternary overflow-hidden">
        {space?.image_avatar_expanded && (
          <img
            src={generateUrl(space?.image_avatar_expanded, { resize: { width: 96, fit: 'contain' } })}
            alt={space?.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-md font-medium">{space?.title}</p>
        <p className="text-sm font-medium">{space?.description}</p>
      </div>
    </Card.Root>
  );
};

export default CommunityPane;
