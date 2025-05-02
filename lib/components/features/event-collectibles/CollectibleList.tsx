import { ethers } from "ethers";

import { modal } from "$lib/components/core";
import { EventOffer } from "$lib/graphql/generated/backend/graphql";
import { TokenComplex, TokensDocument } from "$lib/graphql/generated/metaverse/graphql";
import { Claim, ClaimModifiedDocument, PoapViewDocument, TransferModifiedDocument } from "$lib/graphql/generated/wallet/graphql";
import { useSubscription } from "$lib/graphql/subscription";
import { metaverseClient, walletClient } from "$lib/graphql/request/instances";
import { useAppKitAccount } from "$lib/utils/appkit";
import { useMe } from "$lib/hooks/useMe";

import { ConfirmTransaction } from "../modals/ConfirmTransaction";
import { SuccessModal } from "../modals/SuccessModal";
import { CollectibleClaimed } from "./CollectibleClaimed";
import { CollectibleCard } from "./CollectibleCard";

export function CollectibleList({ tokens, offers }: { tokens: TokenComplex[]; offers: EventOffer[]; }) {
  const me = useMe();
  const { address } = useAppKitAccount();
  const wallets = me?.wallets?.concat(address || []);

  const gridCols = tokens.length <= 2 ? 'grid-cols-2' : 'grid-cols-3';

  useSubscription(ClaimModifiedDocument, {
    onData: (data) => {
      if (data.claimModified.state === 'PENDING') {
        modal.open(
          () => <ConfirmTransaction
            title="Claiming collectible"
            description="Your collectible is being processed. Please wait while we complete this process."
          />,
          {
            dismissible: true
          }
        );
        return;
      }

      if (data.claimModified.state === 'CONFIRMED' && data.claimModified.to) {
        handleClaimed(data.claimModified as Claim);
      }
    },
  });

  useSubscription(TransferModifiedDocument, {
    onData: (data) => {
      if (data.transferModified.state === 'PENDING') {
        modal.open(
          () => <ConfirmTransaction
            title="Transferring Collectible"
            description="Please hold on while we process your transfer. This may take a few seconds to complete on the blockchain."
          />,
          {
            dismissible: true
          }
        );
        return;
      }

      if (data.transferModified.state === 'CONFIRMED') {
        modal.close();
        modal.open(
          () => <SuccessModal
            title="Transfer Complete"
            description={`The collectible has been successfully transferred. It may take a moment to reflect in the recipient's wallet.`}
          />,
          {
            dismissible: true
          }
        );
      }
    },
  });

  const handleClaimed = async (claim: Claim) => {
    walletClient.writeQuery({
      query: PoapViewDocument,
      variables: {
        network: claim.network,
        address: ethers.getAddress(claim.to),
        name: 'hasClaimed',
        args: [wallets],
      },
      data: {
        poapView: ['true'],
      },
    });

    const { data } = await metaverseClient.query({
      query: TokensDocument,
      variables: {
        where: {
          network_eq: claim.network,
          contract_eq: claim.to!.toLowerCase(),
          tokenId_eq: '0',
        },
      },
    });

    modal.close();
    modal.open(
      CollectibleClaimed,
      {
        props: {
          claim,
          token: data?.tokens?.[0]
        },
        dismissible: true
      }
    );
  }

  return (
    <div className="event-description flex flex-col gap-2 w-full">
      <p className="font-medium text-sm">About</p>
      <hr className="border-t border-divider" />
      <div className={`grid ${gridCols} gap-3`}>
        {tokens.map((token) => (
          <CollectibleCard
            key={token.id}
            token={token}
            offer={offers.find(offer => offer.provider_id?.toLowerCase() === token.contract)}
          />
        ))}
      </div>
    </div>
  );
}
