'use client';
import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { Button, Menu, MenuItem } from '$lib/components/core';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { chainsMapAtom, sessionClientAtom } from '$lib/jotai';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { useDisconnect } from '$lib/utils/appkit';
import { useMediaQuery } from '$lib/hooks/useMediaQuery';
import { useClient } from '$lib/graphql/request';

export function LensConnectWallet({ onConnect }: { onConnect: () => void }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);
  const { disconnect } = useDisconnect();
  const setSessionClient = useSetAtom(sessionClientAtom);
  const isDesktop = useMediaQuery('md');
  const { client } = useClient();

  const [wasClicked, setWasClicked] = useState(false);

  useEffect(() => {
    if (wasClicked && isReady) {
      onConnect();
      setWasClicked(false);
    }
  }, [isReady, wasClicked]);

  if (isReady && isDesktop) {
    return (
      <div className="rounded-sm border border-divider space-y-4 p-4">
        <div className="flex justify-between">
          <div className="flex items-center justify-center bg-primary/8 rounded-full size-14">
            <i aria-hidden="true" className="icon-account size-8 text-tertiary" />
          </div>

          <Menu.Root>
            <Menu.Trigger>
              <Button variant="tertiary" size="sm" icon="icon-more-vert" className="rounded-full" />
            </Menu.Trigger>
            <Menu.Content className="p-1">
              {({ toggle }) => (
                <MenuItem
                  onClick={async () => {
                    disconnect();
                    client.resetCustomerHeader();
                    setSessionClient(null);
                    toggle();
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <i aria-hidden="true" className="icon-exit size-4 text-error" />
                    <p className="text-sm text-error">Disconnect</p>
                  </div>
                </MenuItem>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        <div className="space-y-2">
          <p className="text-lg">Get Started</p>
          <p className="text-secondary text-sm">
            Select a profile to join the conversation, explore posts, and share your own.
          </p>
        </div>
        <Button variant="secondary" className="w-full" onClick={onConnect}>
          Select Account
        </Button>
      </div>
    );
  }

  if (isReady) {
    return (
      <div className="rounded-sm border border-divider space-y-4 p-4">
        <div className="space-y-2">
          <p className="text-lg">Get Started</p>
          <p className="text-tertiary text-sm">
            Select a profile to join the conversation, explore posts, and share your own.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="secondary" size="sm" onClick={onConnect}>
            Select Account
          </Button>
          <Menu.Root>
            <Menu.Trigger>
              <Button variant="tertiary" size="sm" icon="icon-more-vert" className="rounded-full" />
            </Menu.Trigger>
            <Menu.Content className="p-1">
              {({ toggle }) => (
                <MenuItem
                  onClick={async () => {
                    disconnect();
                    client.resetCustomerHeader();
                    setSessionClient(null);
                    toggle();
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <i aria-hidden="true" className="icon-exit size-4 text-error" />
                    <p className="text-sm text-error">Disconnect</p>
                  </div>
                </MenuItem>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-divider flex flex-col gap-4 p-4">
      <div className="hidden size-[56px] md:flex justify-center items-center rounded-full bg-primary/8">
        <i aria-hidden="true" className="icon-wallet size-8 text-tertiary" />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Connect Wallet</p>
        <p className="text-tertiary md:text-secondary text-sm">
          Link your wallet to post, comment, and follow top creators on Lemonade.
        </p>
      </div>
      <Button
        variant="secondary"
        size={isDesktop ? 'base' : 'sm'}
        className="w-fit md:w-full"
        onClick={() => {
          setWasClicked(true);
          connect();
        }}
      >
        Connect Wallet
      </Button>
    </div>
  );
}
