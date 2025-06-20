'use client';
import { useAtomValue } from "jotai";

import { Avatar, Button, modal, Skeleton } from "$lib/components/core";
import { useAccountStats, useLemonadeUsername, useResumeSession } from "$lib/hooks/useLens";
import { accountAtom } from "$lib/jotai";
import { getAccountAvatar } from "$lib/utils/lens/utils";

import { LensConnectWallet } from "./LensConnectWallet";
import { SelectProfileModal } from "./SelectProfileModal";
import { ProfileMenu } from "./ProfileMenu";
import { ClaimLemonadeUsernameModal } from "./ClaimLemonadeUsernameModal";

export function LensAccountCard() {
  const { isLoading: loadingSession } = useResumeSession();
  const account = useAtomValue(accountAtom);
  const { stats } = useAccountStats(account);
  const { username, isLoading: isLoadingUsername, refetch } = useLemonadeUsername(account);

  const selectProfile = () => {
    modal.open(SelectProfileModal, { dismissible: true });
  }

  if (loadingSession || isLoadingUsername) return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <Skeleton className="size-14 rounded-full" />
      <Skeleton className="w-full h-10" />
    </div>
  );

  if (account?.username) return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <div className="flex justify-between items-start">
        <Avatar src={getAccountAvatar(account)} className="size-14" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary/8">
            <i className="icon-lens text-secondary size-4" />
            <p className="text-sm text-tertiary max-w-[100px] truncate">{account.username.localName}</p>
          </div>
          <ProfileMenu>
            <Button variant="tertiary" size="sm" icon="icon-more-vert" className="rounded-full" />
          </ProfileMenu>
        </div>
      </div>
      <div className="space-y-2">
        {
          username ? (
            <div className="flex flex-col gap-0.5">
              <p className="text-lg">{account.metadata?.name || username}</p>
              {
                account.metadata?.name && <p className="text-secondary text-sm">{username}</p>
              }
            </div>
          ) : <p className="text-error text-sm italic">No username detected</p>
        }
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
        !username && (
          <Button variant="secondary" className="w-full" onClick={() => modal.open(ClaimLemonadeUsernameModal, { dismissible: true, props: {onComplete: () => refetch() } })}>
            Claim Username
          </Button>
        )
      }
    </div>
  );

  return <LensConnectWallet onConnect={selectProfile} />;
}
