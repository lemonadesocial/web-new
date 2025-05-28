'use client';
import { useEffect } from "react";
import { useAtomValue } from "jotai";

import { Avatar, Button, modal, Skeleton } from "$lib/components/core";
import { useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { useAccount, useAccountStats, useLogIn, useResumeSession } from "$lib/hooks/useLens";
import { randomUserImage } from "$lib/utils/user";
import { formatWallet } from "$lib/utils/crypto";
import { useConnectWallet } from "$lib/hooks/useConnectWallet";
import { chainsMapAtom, sessionClientAtom } from "$lib/jotai";
import { LENS_CHAIN_ID } from "$lib/utils/lens/constants";

import { ClaimUsernameModal } from "./ClaimUsernameModal";
import { getAccountAvatar } from "$lib/utils/lens/utils";

export function LensAccountCard() {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');
  const sessionClient = useAtomValue(sessionClientAtom);

  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);

  const { isLoading: loadingSession, resumeSession } = useResumeSession();
  const { logIn, isLoading: loadingLogIn } = useLogIn();
  const { account, isLoading: loadingAccount } = useAccount();
  const { stats } = useAccountStats();

  useEffect(() => {
    if (!address || !walletProvider) return;

    resumeSession();
  }, [address, walletProvider]);

  const claimUsername = () => {
    modal.open(ClaimUsernameModal);
  }

  if (loadingSession || loadingAccount) return (
    <div className="rounded-sm border border-divider space-y-4 p-4">
      <Skeleton className="size-14 rounded-full" />
      <Skeleton className="w-full h-10" />
    </div>
  );

  if (account?.username) return (
    <div className="rounded-sm border border-divider space-y-4 p-4">
      <Avatar src={getAccountAvatar(account)} className="size-14" />
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

  if (sessionClient) return (
    <div className="rounded-sm border border-divider space-y-4 p-4">
      <Avatar src={randomUserImage()} className="size-14" />
      <div className="space-y-2">
        <p className="text-lg">{formatWallet(address || '')}</p>
        <p className="text-error text-sm">No username detected</p>
        <p className="text-secondary text-sm">Claim your Lemonade username to start posting on the timeline.</p>
      </div>
      <Button variant="secondary" className="w-full" onClick={claimUsername}>
        Claim Username
      </Button>
    </div>
  );

  return (
    <div className="rounded-sm border border-divider space-y-4 p-4">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-primary/8">
        <i className="icon-wallet size-8 text-tertiary" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Connect Wallet</p>
        <p className="text-secondary text-sm">Link your wallet to post, comment, and follow top creators on Lemonade.</p>
      </div>
      <Button variant="secondary" className="w-full" onClick={isReady ? logIn : connect} loading={loadingLogIn}>
        {isReady ? 'Sign In' : 'Connect Wallet'}
      </Button>
    </div>
  );
}
