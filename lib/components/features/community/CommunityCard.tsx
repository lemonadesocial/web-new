import Link from "next/link";
import clsx from "clsx";

import { useMutation } from "$lib/request";
import { useAtom } from "jotai";
import { useMe } from "$lib/hooks/useMe";
import { generateUrl } from "$lib/utils/cnd";
import { sessionAtom } from "$lib/jotai";
import { handleSignIn } from "$lib/utils/ory";
import { LEMONADE_DOMAIN } from "$lib/utils/constants";
import { FollowSpaceDocument, UnfollowSpaceDocument, type Space } from "$lib/generated/backend/graphql";

import { Button } from "$lib/components/core";
import { Card } from "$lib/components/core";

interface CommunityCardProps {
  space?: Space;
}

const CommunityCard = ({ space }: CommunityCardProps) => {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const [follow, resFollow] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: true } });
    },
  });
  const [unfollow, resUnfollow] = useMutation(UnfollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: false } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      // need to login to subscribe
      handleSignIn();
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  const canManage = [space?.creator, ...(space?.admins?.map((p) => p._id) || [])].filter((p) => p).includes(me?._id);
  console.log(space);
  return (
    <Card.Root as="link" href={`/c/${space?.slug}`} className="flex flex-col gap-y-6">

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
        {canManage ? (
          <Link href={`${LEMONADE_DOMAIN}/s/${space?.slug || space?._id}`} target="_blank">
            <Button variant="primary" outlined iconRight="icon-arrow-outward" size="lg">
              <span className="block">Manage</span>
            </Button>
          </Link>
        ) : (
          <Button
            loading={resFollow.loading || resUnfollow.loading}
            outlined={!!space?.followed}
            variant="tertiary-alt" size="sm"
            onClick={() => handleSubscribe()}
          >
            {!!space?.followed ? (
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
        <h3 className="text-xl font-semibold">{space?.title}</h3>
        {space?.description && <p className="text-md text-tertiary line-clamp-2">{space.description}</p>}
      </div>
    </Card.Root>
  );
};

export default CommunityCard;
