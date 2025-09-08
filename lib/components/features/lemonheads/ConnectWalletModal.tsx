import React from 'react';
import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react';
import { Eip1193Provider, ethers } from 'ethers';
import { useAtomValue } from 'jotai';

import { Button, Card, modal, ModalContent } from '$lib/components/core';
import {
  CanMintLemonheadDocument,
  GetListLemonheadSponsorsDocument,
  LemonheadSponsor,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { truncateMiddle } from '$lib/utils/string';
import { LemonheadNFTContract } from '$lib/utils/crypto';
import { chainsMapAtom } from '$lib/jotai';
import { LEMONHEAD_CHAIN_ID } from './utils';

export function ConnectWalletModal({ onContinue }: { onContinue: () => void }) {
  const [minted, setMinted] = React.useState(false);
  const { isConnected, address } = useAppKitAccount();
  const chainsMap = useAtomValue(chainsMapAtom);

  const chain = chainsMap[LEMONHEAD_CHAIN_ID];
  const contractAddress = chain?.lemonhead_contract_address;

  const { data: dataCanMint, loading: loadingWhitelist } = useQuery(CanMintLemonheadDocument, {
    variables: { wallet: address! },
    skip: !address,
    fetchPolicy: 'network-only',
    onComplete: async (data) => {
      let mintedState = false;
      try {
        if (contractAddress) {
          const provider = new ethers.JsonRpcProvider(chain.rpc_url);
          const contract = LemonheadNFTContract.attach(contractAddress).connect(provider);
          const balanceOf = await contract.getFunction('balanceOf')(address);
          mintedState = balanceOf != 0;
          setMinted(mintedState);
        }
      } catch (err) {
        console.log(err);
      }

      if (!mintedState && !data.canMintLemonhead.white_list_enabled) {
        modal.close();
        onContinue();
      }
    },
  });
  const canMint = dataCanMint?.canMintLemonhead.can_mint;
  const isEnabledWhiteList = dataCanMint?.canMintLemonhead.white_list_enabled;

  const { data, loading: loadingSponsors } = useQuery(GetListLemonheadSponsorsDocument, {
    variables: { wallet: address! },
    skip: !address || !isEnabledWhiteList,
    fetchPolicy: 'network-only',
  });

  const sponsor = data?.listLemonheadSponsors.sponsors.find(
    (s) => s.remaining && s.remaining > 0 && s.remaining <= s.limit,
  )?.sponsor as LemonheadSponsor;

  const handleClose = () => {
    modal.close();
  };

  const getIcon = () => {
    if (!isConnected) return 'icon-wallet';

    if (minted) {
      // TODO: add lemonhead claim image here
      return '';
    }

    if (address) {
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

    if (isConnected && minted) {
      return <MintedContent address={address} />;
    }

    return <MintWhiteList sponsor={sponsor} isWhitelist={canMint} address={address} onContinue={onContinue} />;
  };

  if ((isEnabledWhiteList && loadingSponsors) || loadingWhitelist) {
    return (
      <ModalContent
        icon={
          <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
            <i className="icon-loader animate-spin" />
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <p className="text-lg">Checking Your Access</p>
          <p className="text-sm text-secondary">
            We’re checking if you’re on the LemonHeads whitelist. This may take a moment.
          </p>
        </div>
      </ModalContent>
    );
  }

  // NOTE: dont show anything if whitelist is disabled
  if (isConnected && !isEnabledWhiteList && !minted) return null;

  return (
    <ModalContent icon={getIcon()} onClose={handleClose}>
      {getContent()}
    </ModalContent>
  );
}

function ConnectWalletContent() {
  const { open } = useAppKit();

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

function MintWhiteList({
  sponsor,
  isWhitelist,
  address = '',
  onContinue,
}: {
  sponsor: LemonheadSponsor;
  isWhitelist?: boolean;
  address?: string | null;
  onContinue: () => void;
}) {
  const { open } = useAppKit();

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
            {address && <p>{truncateMiddle(address, 6, 4)}</p>}
          </div>
          <i
            className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
            onClick={() => open()}
          />
        </Card.Content>
      </Card.Root>

      <Button variant="secondary" className="w-full" onClick={() => window.open('/e/REPLACE_EVENT_ID', '_blank')}>
        View Event
      </Button>
    </div>
  );
}

function MintedContent({ address }: { address?: string | null }) {
  const { open } = useAppKit();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-lg">You’re already a LemonHead!</p>
        <p className="text-sm text-secondary">
          This wallet has its LemonHead locked in. Each wallet can only hold one, so switch wallets if you’d like to
          mint another.
        </p>
      </div>

      <Card.Root className="border-none bg-none">
        <Card.Content className="justify-between flex items-center py-2 px-3">
          <div className="flex gap-3">
            <i className="icon-wallet size-5 aspect-square text-tertiary" />
            {address && <p>{truncateMiddle(address, 6, 4)}</p>}
          </div>
          <i
            className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
            onClick={() => open()}
          />
        </Card.Content>
      </Card.Root>

      <Button variant="secondary" className="w-full" onClick={() => modal.close()}>
        Done
      </Button>
    </div>
  );
}
