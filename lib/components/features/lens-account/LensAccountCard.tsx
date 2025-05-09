'use client';
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { Avatar, Button } from "$lib/components/core";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { useAccount, useLogIn, useResumeSession } from "$lib/hooks/useLens";
import { sessionClientAtom } from "$lib/jotai/lens";
import { randomUserImage } from "$lib/utils/user";
import { formatWallet } from "$lib/utils/crypto";

export function LensAccountCard() {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('eip155');

  const sessionClient = useAtomValue(sessionClientAtom);

  const { isLoading: loadingSession, resumeSession } = useResumeSession();
  const { logIn, isLoading: loadingLogIn } = useLogIn();
  const { account, isLoading: loadingAccount } = useAccount();

  console.log('sessionClient', sessionClient);
  console.log('account', account);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!address || !walletProvider) return;

    resumeSession();
  }, []);

  useEffect(() => {
    if (!walletProvider || !connecting) return;

    setConnecting(false);

    logIn();
  }, [walletProvider, connecting]);

  const handleConnect = () => {
    if (!walletProvider) {
      setConnecting(true);
      open();
      return;
    }

    logIn();
  }

  if (loadingSession || loadingAccount) return null;

  if (account && !account.username) return (
    <div className="rounded-sm border border-divider space-y-4 p-4 w-[336px]">
      <Avatar src={randomUserImage()} className="size-14" />
      <div className="space-y-2">
        <p className="text-lg">{formatWallet(address || '')}</p>
        <p className="text-error-400 text-sm">No username detected</p>
        <p className="text-secondary text-sm">Claim your Lemonade username to start posting on the timeline.</p>
      </div>
      <Button variant="secondary" className="w-full" onClick={handleConnect} loading={loadingLogIn}>
        Claim Username
      </Button>
    </div>
  );
  
  return (
    <div className="rounded-sm border border-divider space-y-4 p-4 w-[336px]">
      <div className="size-[56px] flex justify-center items-center rounded-full bg-primary/8">
        <i className="icon-wallet size-8 text-tertiary" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Connect Wallet</p>
        <p className="text-secondary text-sm">Link your wallet to post, comment, and follow top creators on Lemonade.</p>
      </div>
      <Button variant="secondary" className="w-full" onClick={handleConnect} loading={loadingLogIn}>
        Connect Wallet
      </Button>
    </div>
  );
}
