'use client';
import React from 'react';
import { match } from 'ts-pattern';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Account, evmAddress, Follower } from '@lens-protocol/client';
import { fetchAccount, follow, unfollow, fetchFollowers } from '@lens-protocol/client/actions';

import { Button, drawer, toast } from '$lib/components/core';
import { getErrorMessage } from '$lib/utils/error';
import { User } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { userAvatar } from '$lib/utils/user';
import { useMe } from '$lib/hooks/useMe';
import { useAccount, useLensAuth } from '$lib/hooks/useLens';
import { sessionClientAtom } from '$lib/jotai';
import { useSigner } from '$lib/hooks/useSigner';
import { ProfilePane } from '../pane';
import { isAddress } from 'ethers';
import { client } from '$lib/utils/lens/client';
import { useAppKitAccount } from '@reown/appkit/react';

interface Props {
  address?: string;
  /** extends user coverPicture from lens */
  user?: User & { coverPicture?: string };
  canEdit?: boolean;
  containerClass?: string;
}
export function UserProfileHero({ address, user, canEdit, containerClass }: Props) {
  const me = useMe();
  const [loading, setLoading] = React.useState(false);
  const { account } = useAccount();

  const [followed, setFollowed] = React.useState(false);

  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();

  const handleLensAuth = useLensAuth();

  const handleFollow = async () => {
    if (!sessionClient || !signer) {
      toast.error('Please connect your wallet');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (!followed) {
        result = await follow(sessionClient, {
          account: address,
        });
      } else {
        result = await unfollow(sessionClient, {
          account: address,
        });
      }

      if (result?.isErr()) {
        toast.error(`Failed to ${followed ? 'followed ' : 'unfollowed '} user`);
        return;
      }

      // NOTE: need to await lens update state before user can action
      await setFollowed((prev) => !prev);
      toast.success(`Successfully ${followed ? 'followed!' : 'unfollowed!'}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to follow user'));
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async () => {
    if (address && isAddress(address)) {
      const result = await fetchFollowers(client, { account: evmAddress(address) });

      if (result.isErr()) {
        return console.error(result.error);
      }

      const { items, pageInfo: _ } = result.value;
      setFollowed(items.findIndex((i) => i.follower.address === account?.address) !== -1);
    }
  };

  React.useEffect(() => {
    if (account && address) {
      getFollowers();
    }
  }, [account, address]);

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden',
        user?.cover_expanded || user?.coverPicture ? 'h-[154px] md:h-[280px]' : 'h-24 md:h-36',
        containerClass,
      )}
    >
      {user?.coverPicture || user?.cover_expanded ? (
        <>
          <img
            className="md:hidden aspect-[3.5/1] object-cover rounded-md w-full max-h-2/3"
            loading="lazy"
            src={
              user?.coverPicture ||
              generateUrl(user?.cover_expanded, {
                resize: { width: 480, fit: 'contain' },
              })
            }
          />
          <img
            src={
              user?.coverPicture ||
              generateUrl(user?.cover_expanded, {
                resize: { width: 1080, fit: 'contain' },
              })
            }
            loading="lazy"
            className="hidden md:block aspect-[3.5/1] object-cover rounded-md w-full"
          />
        </>
      ) : null}

      <div className="user-dp absolute bottom-1.5 md:bottom-4 size-20 md:size-28 rounded-full overflow-hidden border">
        <img className="w-full h-full outline outline-tertiary/4 rounded-md" src={userAvatar(user)} />
      </div>

      <div className="absolute bottom-0 md:bottom-4 right-0">
        <div className="flex items-center gap-3">
          {match(canEdit)
            .with(true, () => (
              <Button iconLeft="icon-edit-sharp" variant="tertiary" size="sm" onClick={() => drawer.open(ProfilePane)}>
                Edit Profile
              </Button>
            ))
            .otherwise(() => (
              <div className="flex items-center gap-2">
                {user?._id !== me?._id && (
                  <Button loading={loading} size="sm" outlined={followed} onClick={() => handleLensAuth(handleFollow)}>
                    {followed ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
                {/* <Button icon="icon-heart-outline" size="sm" variant="tertiary-alt"></Button> */}
                {/* <Button icon="icon-more-horiz" variant="tertiary-alt" size="sm"></Button> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
