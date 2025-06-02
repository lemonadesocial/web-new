'use client';
import { useEffect } from "react";
import { useAtomValue } from "jotai";

import { Avatar, Button, modal, Skeleton } from "$lib/components/core";
import { useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { useAccountStats, useResumeSession } from "$lib/hooks/useLens";
import { accountAtom } from "$lib/jotai";
import { getAccountAvatar } from "$lib/utils/lens/utils";

import { LensConnectWallet } from "./LensConnectWallet";
import { SelectProfileModal } from "./SelectProfileModal";
import { ProfileMenu } from "./ProfileMenu";

export function LensAccountCard() {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const { isLoading: loadingSession, resumeSession } = useResumeSession();
  const account = useAtomValue(accountAtom);
  const { stats } = useAccountStats();

  useEffect(() => {
    if (!address || !walletProvider) return;

    resumeSession();
  }, [address, walletProvider]);


  const selectProfile = () => {
    modal.open(SelectProfileModal, { dismissible: true });
  }

  if (loadingSession) return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <Skeleton className="size-14 rounded-full" />
      <Skeleton className="w-full h-10" />
    </div>
  );

  if (account?.username) return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <div className="flex justify-between">
        <Avatar src={getAccountAvatar(account)} className="size-14" />
        <ProfileMenu>
          <Button variant="tertiary" size="sm" icon="icon-more-vert" className="rounded-full" />
        </ProfileMenu>
      </div>
      <div className="space-y-2">
        <p className="text-lg">{account.username.localName}</p>
        <div className="flex gap-3">
          <p className="text-secondary text-sm">
            {stats.followers} Followers
          </p>
          <p className="text-secondary text-sm">
            {stats.following} Following
          </p>
        </div>
      </div>
    </div>
  );

  return <LensConnectWallet onConnect={selectProfile} />;
}
