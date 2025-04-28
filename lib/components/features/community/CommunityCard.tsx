import { useMutation } from "$lib/graphql/request";
import { generateUrl } from "$lib/utils/cnd";
import { useSignIn } from "$lib/hooks/useSignIn";
import { useSession } from "$lib/hooks/useSession";
import { FollowSpaceDocument, PublicSpace, UnfollowSpaceDocument } from "$lib/graphql/generated/backend/graphql";

import { Button } from "$lib/components/core";
import { Card } from "$lib/components/core";

interface CommunityCardProps {
  space: PublicSpace;
}

const CommunityCard = ({ space }: CommunityCardProps) => {
  const session = useSession();
  const signIn = useSignIn();
  const [follow, resFollow] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space._id}`, data: { followed: true } });
    },
  });
  const [unfollow, resUnfollow] = useMutation(UnfollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space._id}`, data: { followed: false } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      // need to login to subscribe
      signIn();
      return;
    }

    const variables = { space: space._id };
    if (space.followed) unfollow({ variables });
    else follow({ variables });
  };


  return (
    <Card.Root as="link" href={`/s/${space.slug || space._id}`} className="flex flex-col gap-y-6">

      <div className="flex justify-between">
        <div className="w-12 h-12 rounded-sm bg-quaternary overflow-hidden">
          {space?.image_avatar_expanded && (
            <img
              src={generateUrl(space?.image_avatar_expanded, { resize: { width: 96, fit: 'contain' } })}
              alt={space?.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {space.is_admin ? (
          <div>
            <Button variant="primary" outlined iconRight="icon-arrow-outward" size="sm" onClick={(e) => {
              e.preventDefault();
              window.open(`/s/${space.slug || space._id}`, '_blank');
            }}>
              <span className="block">Manage</span>
            </Button>
          </div>
        ) : (
          <Button
            loading={resFollow.loading || resUnfollow.loading}
            outlined={!!space.followed}
            variant="tertiary-alt" size="sm"
            onClick={() => handleSubscribe()}
          >
            {!!space.followed ? (
              <>
                <span className="hidden group-hover:block">Unsubscribe</span>
                <span className="block group-hover:hidden">Subscribed</span>
              </>
            ) : (
              'Subscribe'
            )}
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        <h3 className="text-xl font-semibold text-primary">{space.title}</h3>
        {space.description && <p className="text-md text-tertiary line-clamp-2">{space.description}</p>}
      </div>
    </Card.Root>
  );
};

export default CommunityCard;
