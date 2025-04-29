import { ethers } from "ethers";
import { useMemo } from "react";

import { TokenComplex } from "$lib/graphql/generated/metaverse/graphql";
import { PoapViewDocument } from "$lib/graphql/generated/wallet/graphql";
import { useQuery } from "$lib/graphql/request";
import { walletClient } from "$lib/graphql/request/instances";
import { useMe } from "$lib/hooks/useMe";
import { useAppKitAccount } from "$lib/utils/appkit";

export function usePOAPInfo(token: TokenComplex) {
  const { data: supplyData } = useQuery(PoapViewDocument, {
    variables: {
      network: token.network,
      address: ethers.getAddress(token.contract),
      name: 'supply'
    },
  }, walletClient);

  const [isUnlimited, supplyCount, claimedCount, totalCount] = useMemo(() => {
    if (!supplyData) return [];
    if (supplyData?.poapView[1] === '0') return [true, undefined];

    return [
      false,
      BigInt(supplyData.poapView[1]) - BigInt(supplyData.poapView[0]),
      BigInt(supplyData.poapView[0]),
      BigInt(supplyData.poapView[1]),
    ];
    ;
  }, [supplyData]);

  return { isUnlimited, supplyCount, claimedCount, totalCount };
}

export function usePOAPClaimCheck(token: { network: string, contract: string }) {
  const me = useMe();
  const { address } = useAppKitAccount();

  const wallets = me?.wallets?.concat(address || []);

  const { data: hasClaimedData, refetch: refetchClaimedData } = useQuery(PoapViewDocument, {
    skip: !wallets?.length || !token.network || !token.contract,
    variables: {
      network: token.network,
      address: ethers.getAddress(token.contract),
      name: 'hasClaimed',
      args: [wallets],
    }},
    walletClient,
  );

  const hasClaimed = hasClaimedData?.poapView.some(x => x === 'true');

  return { hasClaimed, refetchClaimedData };
}
