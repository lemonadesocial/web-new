import { ethers } from "ethers";

import { Button, toast } from "$lib/components/core";
import { Offer } from "$lib/graphql/generated/backend/graphql";
import { TokenComplex } from "$lib/graphql/generated/metaverse/graphql";
import { ClaimPoapDocument } from "$lib/graphql/generated/wallet/graphql";
import { useMutation } from "$lib/graphql/request";
import { walletClient } from "$lib/graphql/request/instances";
import { getListChains } from "$lib/utils/crypto";

import { usePOAPInfo, usePOAPClaimCheck } from "./hooks";
import { MetaMedia } from "../MetaMedia";

export function CollectibleCard({ token, offer }: { token: TokenComplex; offer: Offer; }) {
  const network = getListChains().find(chain => chain.code_name === offer.provider_network);
  const { claimedCount, totalCount } = usePOAPInfo(token);
  const { hasClaimed } = usePOAPClaimCheck(token);

  const progress = totalCount && totalCount > 0 ? Number(claimedCount) / Number(totalCount) : 0;

  const [claimPoap, { loading }] = useMutation(
    ClaimPoapDocument,
    {
      onError(error) {
        toast.error(error.message)
      },
    },
    walletClient
  );

  return (
    <div className="bg-card-background border border-card-border rounded-md p-4 space-y-4">
      <div className="flex items-center justify-center aspect-square">
        <MetaMedia metadata={token.metadata} className="border border-card-border rounded-sm h-min max-h-full" />
      </div>
      <div className="flex items-center justify-between">
        <p className="font-lg truncate">{token.metadata?.name}</p>
        <img src={network?.logo_url} className="w-4 h-4" />
      </div>
      <div>
        <CollectibleProgressBar progress={progress} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-tertiary">{claimedCount} claimed</span>
          <span className="text-sm text-tertiary">{totalCount}</span>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={hasClaimed}
        className="w-full"
        onClick={() => claimPoap({
          variables: {
            network: offer.provider_network,
            address: ethers.getAddress(token.contract)
          },
        })}
        loading={loading}
      >
        {hasClaimed ? 'Claimed' : 'Claim'}
      </Button>
    </div>
  );
}

type ProgressBarProps = {
  progress: number; // 0 to 1
};

export function CollectibleProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      className="relative w-full h-[4px]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='199' height='5' viewBox='0 0 199 5' fill='none'><path d='M3.32812 2.66602H196.328' stroke='white' stroke-opacity='0.08' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='4 8'/></svg>\")",
        backgroundRepeat: "repeat-x",
        backgroundSize: "auto 100%",
      }}
    >
      <div
        className="absolute top-0 left-0 h-[4px] rounded"
        style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          background: "white",
        }}
      />
    </div>
  );
}
