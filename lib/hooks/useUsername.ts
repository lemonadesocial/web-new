import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { createDrift } from "@gud/drift";

import { modal } from "$lib/components/core";
import { ClaimLemonadeUsernameModal } from "$lib/components/features/modals/ClaimLemonadeUsernameModal";
import { ConnectWallet } from "$lib/components/features/modals/ConnectWallet";
import { listChainsAtom } from "$lib/jotai";
import { useAppKitAccount } from "$lib/utils/appkit";
import { usernameClient } from "$lib/graphql/request/instances";
import { TokenOwnerDocument, TokenOwnerQueryVariables } from "$lib/graphql/generated/username/graphql";
import { LemonadeUsernameABI } from "$lib/abis/LemonadeUsername";
import { Chain } from "$lib/graphql/generated/backend/graphql";
import { getFetchableUrl } from "$lib/utils/metadata";

export const useClaimUsername = () => {
  const listChains = useAtomValue(listChainsAtom);
  const usernameChain = listChains.find(chain => chain.lemonade_username_contract_address)!;

  const open = () => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          modal.open(ClaimLemonadeUsernameModal);
        },
        chain: usernameChain,
      },
    });
  }

  return open;
}

async function fetchLemonadeUsernameToken(address: string, usernameChain: Chain | undefined) {
  if (!usernameChain) {
    return null;
  }

  const variables: TokenOwnerQueryVariables = {
    where: {
      owner: {
        _eq: address.toLowerCase(),
      },
    },
  };

  const { data } = await usernameClient.query({
    query: TokenOwnerDocument,
    variables,
  });

  if (data?.TokenOwner && data.TokenOwner.length > 0) {
    const firstToken = data.TokenOwner[0];
    const tokenId = firstToken.tokenId.toString();

    const drift = createDrift({
      rpcUrl: usernameChain.rpc_url,
    });

    const tokenUri = await drift.read({
      abi: LemonadeUsernameABI,
      address: usernameChain.lemonade_username_contract_address as `0x${string}`,
      fn: 'tokenURI',
      args: {
        tokenId: BigInt(tokenId),
      },
    });

    const fetchableUrl = getFetchableUrl(tokenUri as string);
    const response = await fetch(fetchableUrl.href);
    const metadata = await response.json();
    const username = metadata.name as string;

    return {
      username
    };
  }

  return null;
}

export const useLemonadeUsername = () => {
  const { address } = useAppKitAccount();
  const listChains = useAtomValue(listChainsAtom);
  const usernameChain = listChains.find(chain => chain.lemonade_username_contract_address);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['lemonadeUsername', address],
    queryFn: () => fetchLemonadeUsernameToken(address!, usernameChain),
    enabled: !!address && !!usernameChain,
  });

  return { 
    username: data?.username ?? null,
    isLoading, 
    error 
  };
}
