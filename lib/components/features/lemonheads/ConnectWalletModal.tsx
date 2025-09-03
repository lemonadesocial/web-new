import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';

import { Button, Card, ErrorText, modal, ModalContent, toast } from '$lib/components/core';
import {
  CanMintLemonheadDocument,
  GetListLemonheadSponsorsDocument,
  LemonheadSponsor,
  LemonheadSponsorDetail,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { useHandleVerifyWallet } from '$lib/hooks/useSignIn';
import { useSignWallet } from '$lib/hooks/useSignWallet';
import { chainsMapAtom, userAtom } from '$lib/jotai';
import { formatError } from '$lib/utils/crypto';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { truncateMiddle } from '$lib/utils/string';

export function ConnectWalletModal({ onContinue }: { onContinue: () => void }) {
  const { isConnected } = useAppKitAccount();
  const me = useMe();

  const { data, loading: loadingSponsors } = useQuery(GetListLemonheadSponsorsDocument, {
    variables: { wallet: me?.kratos_wallet_address! },
    skip: !me?.kratos_wallet_address,
    fetchPolicy: 'network-only',
  });

  const sponsor = data?.listLemonheadSponsors.sponsors.find(
    (s) => s.remaining && s.remaining > 0 && s.remaining <= s.limit,
  )?.sponsor as LemonheadSponsor;

  const { data: dataCanMint, loading: loadingWhitelist } = useQuery(CanMintLemonheadDocument, {
    variables: { wallet: me?.kratos_wallet_address! },
    skip: !me?.kratos_wallet_address,
    fetchPolicy: 'network-only',
  });
  const canMint = dataCanMint?.canMintLemonhead.can_mint;

  const handleClose = () => {
    modal.close();
  };

  const getIcon = () => {
    if (!isConnected) return 'icon-wallet';
    if (me?.kratos_wallet_address) {
      return canMint || sponsor ? (
        <div className="size-[56px] flex justify-center items-center rounded-full bg-success-500/16" data-icon>
          <i className="icon-done text-success-500 size-8" />
        </div>
      ) : (
        <div className="size-[56px] flex justify-center items-center rounded-full bg-warning-500/16" data-icon>
          <i className="icon-info text-warning-500 size-8" />
        </div>
      );
    }
    return '';
  };

  const getContent = () => {
    if (!isConnected) {
      return <ConnectWalletContent />;
    }

    if (!me?.kratos_wallet_address) return <VerifyWallet />;

    return (
      <MintWhiteList
        sponsor={sponsor}
        isWhitelist={canMint}
        address={me.kratos_wallet_address}
        onContinue={onContinue}
      />
    );
  };

  if (loadingSponsors || loadingWhitelist)
    return (
      <ModalContent>
        <p>Loading...</p>
      </ModalContent>
    );

  return (
    <ModalContent icon={getIcon()} title={!me?.kratos_wallet_address && 'Verify Wallet'} onClose={handleClose}>
      {getContent()}
    </ModalContent>
  );
}

function ConnectWalletContent() {
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork();
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[LENS_CHAIN_ID];

  const isChainValid = chainId?.toString() === LENS_CHAIN_ID && chain;

  return (
    <>
      <p className="text-lg">Connect Wallet</p>
      <p className="text-secondary mt-2">
        You can connect with Rabby, Metamask, Coinbase Wallet, Rainbow, and other Ethereum wallets.
      </p>
      <Button variant="secondary" className="w-full mt-4" onClick={() => open()}>
        Connect Wallet
      </Button>
    </>
  );
}

function VerifyWallet() {
  const { address } = useAppKitAccount();
  const signWallet = useSignWallet();
  const [me, setMe] = useAtom(userAtom);

  const {
    processSignature,
    loading: loadingVerify,
    error: errorVerify,
  } = useHandleVerifyWallet({
    onSuccess: async () => {
      if (me) {
        setMe({ ...(me as User), kratos_wallet_address: address });
      }
    },
  });

  const handleVerify = () => {
    if (!address) return;

    signWallet()
      .then(async ({ signature, token }) => {
        processSignature(signature, token, address);
      })
      .catch((err) => {
        toast.error(formatError(err));
      });
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="size-[34px] flex justify-center items-center rounded-full bg-primary/8" data-icon>
            <i className="icon-wallet text-tertiary size-[18px]" />
          </div>

          <div className="flex flex-col gap-[2px]">
            <p className="text-xs text-tertiary">Connected Wallet</p>
            <div className="flex items-center gap-2">
              <p>{truncateMiddle(address!, 6, 4)}</p>
              <i className="icon-edit-sharp size-4" />
            </div>
          </div>
        </div>
        <p className="text-secondary">
          Please sign a message to verify your ownership of the wallet. This will not incur any cost.
        </p>
        <p className="text-sm text-tertiary">Make sure the message starts with ‘Lemonade would like you...'.</p>

        {errorVerify && <ErrorText message={errorVerify} />}
      </div>

      <Button variant="secondary" disabled={loadingVerify} className="w-full mt-4" onClick={handleVerify}>
        {loadingVerify ? 'Waiting for Signature...' : 'Sign Message'}
      </Button>
    </>
  );
}

function MintWhiteList({
  sponsor,
  isWhitelist,
  address,
  onContinue,
}: {
  sponsor: LemonheadSponsor;
  isWhitelist?: boolean;
  address: string;
  onContinue: () => void;
}) {
  if (isWhitelist || sponsor) {
    return (
      <>
        <p className="text-lg">You’re On The Whitelist!</p>
        <p className="text-sm text-secondary">
          You can now personalize your LemonHead to make it truly yours before minting your on-chain identity.
        </p>

        {sponsor && (
          <div className="border-t">
            <div key={sponsor._id} className="flex flex-col gap-3 py-3.5">
              <div className="flex gap-2.5">
                <img src={sponsor.image_url} className="rounded-sm w-[34px] aspect-square" />
                <div>
                  <p>You’ve unlocked a free mint!</p>
                  <p className="text-tertiary text-xs">Supported by {sponsor.name}</p>
                </div>
              </div>

              <div className="relative">
                <div className="w-0 h-0 border-solid border-t-0 border-l-[6px] border-r-[6px] border-b-[6px] border-t-transparent border-r-transparent border-l-transparent border-b-(--btn-tertiary) absolute left-[10px] -top-[6px]" />
                <div className="px-3 py-2 text-sm bg-(--btn-tertiary) rounded-sm">{sponsor.message}</div>
              </div>
            </div>
          </div>
        )}

        <Button variant="secondary" className="w-full mt-4" onClick={() => onContinue()}>
          Continue
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-lg">You’re Not on the List Yet</p>
        <p className="text-sm text-secondary">
          You’re not whitelisted to mint your LemonHead yet. Register to the LemonHeads Launch to secure your spot.
        </p>
      </div>

      <Card.Root className="border-none bg-none">
        <Card.Content className="justify-between flex items-center py-2 px-3">
          <div className="flex gap-3">
            <i className="icon-wallet size-5 aspect-square text-tertiary" />
            <p>{truncateMiddle(address, 6, 4)}</p>
          </div>
          <i className="icon-edit-sharp size-5 aspect-square text-quaternary" />
        </Card.Content>
      </Card.Root>

      <Button variant="secondary" className="w-full" onClick={() => window.open('/e/REPLACE_EVENT_ID', '_blank')}>
        View Event
      </Button>
    </div>
  );
}
