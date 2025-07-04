'use client';
import { useEffect, useState } from 'react';
import { AccountManaged, evmAddress } from '@lens-protocol/client';
import { fetchAccountsAvailable, fetchUsernames } from '@lens-protocol/client/actions';
import { signMessageWith } from '@lens-protocol/client/ethers';
import { useSetAtom } from 'jotai';

import { Avatar, Button, modal, ModalContent, Skeleton, toast } from '$lib/components/core';
import { useAppKitAccount } from '$lib/utils/appkit';
import { client } from '$lib/utils/lens/client';
import { useSigner } from '$lib/hooks/useSigner';
import { accountAtom, sessionClientAtom } from '$lib/jotai';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { LENS_NAMESPACE } from '$lib/utils/constants';
import { formatError, formatWallet } from '$lib/utils/crypto';

import { SignTransactionModal } from '../modals/SignTransaction';
import { ClaimLemonadeUsernameModal } from './ClaimLemonadeUsernameModal';
import { ClaimAccountModal } from './ClaimAccountModal';
import { useSyncLensAccount } from '$lib/hooks/useLens';
import { useClient } from '$lib/graphql/request';

export function SelectProfileModal() {
  const [accounts, setAccounts] = useState<AccountManaged[]>([]);
  const { address } = useAppKitAccount();
  const signer = useSigner();
  const setSessionClient = useSetAtom(sessionClientAtom);
  const setAccount = useSetAtom(accountAtom);

  const requestClient = useClient();
  const { triggerSync } = useSyncLensAccount();

  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingSignIn, setIsLoadingSignIn] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await fetchAccountsAvailable(client, {
        managedBy: address,
        includeOwned: true,
      });

      setIsLoadingAccounts(false);

      if (accounts.isErr()) {
        toast.error(accounts.error.message);
        modal.close();
        return;
      }

      if (accounts.value.items.length) {
        setAccounts(accounts.value.items as AccountManaged[]);
      }
    };

    if (address) {
      fetchAccounts();
    }
  }, [address]);

  const handleSignIn = async () => {
    if (!signer) return;

    setIsLoadingSignIn(true);

    const onboardingResult = await client.login({
      onboardingUser: {
        app: process.env.NEXT_PUBLIC_LENS_APP_ID,
        wallet: signer.address,
      },
      signMessage: signMessageWith(signer),
    });

    setIsLoadingSignIn(false);
    modal.close();

    if (onboardingResult.isErr()) {
      const friendlyMessage = formatError(onboardingResult.error);
      toast.error(friendlyMessage);
      return;
    }

    setSessionClient(onboardingResult.value);
    modal.open(ClaimAccountModal);
  };

  const handleSelectProfile = async (item: AccountManaged) => {
    if (!signer) return;

    const account = item.account;

    setSelectedAccount(account.address);
    const loginAs =
      (item as { __typename: 'AccountOwned' | 'AccountManaged' }).__typename === 'AccountOwned'
        ? {
            accountOwner: {
              owner: address,
              account: item.account.address,
            },
          }
        : {
            accountManager: {
              manager: address,
              account: account.address,
            },
          };

    const loginResult = await client.login({
      ...loginAs,
      signMessage: signMessageWith(signer),
    });

    setSelectedAccount(null);

    if (loginResult.isErr()) {
      const friendlyMessage = formatError(loginResult.error);
      toast.error(friendlyMessage);
      return;
    }

    setSessionClient(loginResult.value);
    setAccount(account);
    modal.close();

    requestClient.client.addCustomheader({ 'x-lens-profile-id': account.address });
    await triggerSync(account, loginResult.value);

    const lemonadeUsernamesRes = await fetchUsernames(client, {
      filter: {
        owner: account.address,
        namespace: evmAddress(LENS_NAMESPACE),
      },
    });

    if (lemonadeUsernamesRes.isErr()) return;

    const lemonadeUsernames = lemonadeUsernamesRes.value.items;

    if (lemonadeUsernames.length) return;

    modal.open(ClaimLemonadeUsernameModal);
  };

  if (isLoadingAccounts)
    return (
      <ModalContent>
        <Skeleton className="size-14 rounded-full" />
        <Skeleton className="w-full h-10 mt-4" />
      </ModalContent>
    );

  if (!accounts.length)
    return (
      <SignTransactionModal
        title="Verify Wallet"
        onClose={() => modal.close()}
        description="Please sign a message to onboard your Lens account. This will not incur any cost."
        onSign={handleSignIn}
        loading={isLoadingSignIn}
      />
    );

  return (
    <ModalContent icon="icon-account">
      <p>Select Account</p>
      <p className="mt-2 text-secondary text-sm">
        Pick your account to load your personalized timeline—or create a new one to start fresh!.
      </p>
      <div className="mt-4 space-y-2">
        {accounts.map((item) => (
          <div
            key={item.account.address}
            className="py-2 px-3 gap-3 flex items-center rounded-sm bg-primary/8 cursor-pointer"
            onClick={() => handleSelectProfile(item)}
          >
            <Avatar src={getAccountAvatar(item.account)} className="size-5" />
            <p className="flex-1">{item.account.username?.localName || item.account.metadata?.name || formatWallet(item.account.address)}</p>
            {selectedAccount === item.account.address && <i className="size-5 animate-spin icon-loader" />}
          </div>
        ))}
      </div>
      <Button
        variant="secondary"
        className="w-full mt-4"
        onClick={handleSignIn}
        disabled={!!selectedAccount}
        loading={isLoadingSignIn}
      >
        New Account
      </Button>
    </ModalContent>
  );
}
