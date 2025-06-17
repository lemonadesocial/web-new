'use client';
import { fetchFollowStatus, follow, unfollow } from "@lens-protocol/client/actions";
import { Account } from "@lens-protocol/client";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { Avatar, Button, modal } from "$lib/components/core";
import { useAccountStats, useLensAuth, useResumeSession } from "$lib/hooks/useLens";
import { accountAtom, sessionClientAtom } from "$lib/jotai";
import { getAccountAvatar } from "$lib/utils/lens/utils";
import { useSigner } from "$lib/hooks/useSigner";

import { ProfileMenu } from "./ProfileMenu";
import { EditProfileModal } from "./EditProfileModal";

export function LensProfileCard({ account }: { account: Account }) {
  const { stats } = useAccountStats(account);
  const sessionClient = useAtomValue(sessionClientAtom);
  const myAccount = useAtomValue(accountAtom);

  const handleLensAuth = useLensAuth();
  useResumeSession();
  const signer = useSigner();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const isOwner = myAccount?.address?.toLowerCase() === account.address?.toLowerCase();
  const displayAccount = isOwner && myAccount ? myAccount : account;

  useEffect(() => {
    if (!sessionClient || !myAccount) return;

    (async () => {
      setIsLoadingStatus(true);
      const result = await fetchFollowStatus(sessionClient, {
        pairs: [{
          account: account.address,
          follower: myAccount.address,
        }],
      });

      if (result.isErr()) return;

      setIsFollowing(result.value[0]?.isFollowing.onChain);
      setIsLoadingStatus(false);
    })();
  }, [account, myAccount, sessionClient]);

  const handleFollow = async () => {
    if (!sessionClient || !signer) return;

    setIsExecuting(true);

    const action = isFollowing ? unfollow : follow;

    const result = await action(sessionClient, {
      account: account.address,
    });

    setIsExecuting(false);
    if (result.isOk()) {
      setIsFollowing(prev => !prev);
    }
  }

  return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <div className="flex justify-between">
        <Avatar src={getAccountAvatar(displayAccount)} className="size-14" />
        <div className="flex items-center gap-2">
          {
            displayAccount.username && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/8">
                <i className="icon-lens text-secondary size-4" />
                <p className="text-sm text-tertiary max-w-[100px] truncate">{displayAccount.username.localName}</p>
              </div>
            )
          }
          {isOwner && (
            <ProfileMenu>
              <Button variant="tertiary" size="sm" icon="icon-more-vert" className="rounded-full" />
            </ProfileMenu>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-lg">{displayAccount.metadata?.name || displayAccount.username?.localName}</p>
          {
            !!displayAccount.metadata?.name && <p className="text-secondary text-sm">{displayAccount.username?.localName}</p>
          }
        </div>
        <div className="flex gap-3">
          <p className="text-secondary text-sm">
            {stats.followers} Followers
          </p>
          <p className="text-secondary text-sm">
            {stats.following} Following
          </p>
        </div>
      </div>
      {
        isOwner ? (
          <Button variant="tertiary" className="w-full" onClick={() => modal.open(EditProfileModal)}>
            Edit Profile
          </Button>
        ) : (
          <Button
            variant={isFollowing ? 'tertiary' : 'secondary'}
            className="w-full"
            onClick={() => handleLensAuth(handleFollow)}
            loading={isExecuting}
            disabled={isLoadingStatus}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )
      }
    </div>
  );
}
