"use client";

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import NexusDeposit from "$lib/components/features/avail/deposit/nexus-deposit";
import { modal, Button } from "$lib/components/core";
import { ConnectWallet } from "$lib/components/features/modals/ConnectWallet";
import {
  SUPPORTED_CHAINS,
  TOKEN_CONTRACT_ADDRESSES,
  TOKEN_METADATA,
  CHAIN_METADATA,
} from "@avail-project/nexus-core";
import type { EthereumProvider } from "@avail-project/nexus-core";
import { encodeFunctionData, type Abi } from "viem";
import { useAccount } from "wagmi";
import { useAppKitAccount } from "$lib/utils/appkit";
import { formatWallet } from "$lib/utils/crypto";
import { chainsMapAtom } from "$lib/jotai";
import { useNexus } from "$lib/components/features/avail/nexus/NexusProvider";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAppKitAccount();
  const { connector } = useAccount();
  const { handleInit } = useNexus();

  const chainsMap = useAtomValue(chainsMapAtom);
  const baseChain = chainsMap[SUPPORTED_CHAINS.BASE.toString()];

  useEffect(() => {
    if (connector && isConnected) {
      connector.getProvider().then(p => handleInit(p as EthereumProvider));
    }
  }, [connector, isConnected, handleInit]);

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="flex flex-col gap-4">
        <Button
          variant="secondary"
          iconLeft="icon-wallet"
          onClick={() =>
            modal.open(ConnectWallet, {
              props: {
                onConnect: () => {},
                chain: baseChain,
              },
            })
          }
        >
          {isConnected && address ? formatWallet(address) : "Connect Wallet"}
        </Button>
        <NexusDeposit
          open={isOpen}
          onOpenChange={setIsOpen}
          destination={{
            chainId: SUPPORTED_CHAINS.BASE,
            tokenAddress: TOKEN_CONTRACT_ADDRESSES["USDC"][SUPPORTED_CHAINS.BASE],
            tokenSymbol: "USDC",
            tokenDecimals: TOKEN_METADATA["USDC"].decimals,
            tokenLogo: TOKEN_METADATA["USDC"].icon,
            label: "Deposit USDC on Aave Base",
            gasTokenSymbol:
              CHAIN_METADATA[SUPPORTED_CHAINS.BASE].nativeCurrency.symbol,
            estimatedTime: "~ 30s",
            explorerUrl:
              CHAIN_METADATA[SUPPORTED_CHAINS.BASE].blockExplorerUrls[0],
            // depositTargetLogo: "path/to/dapp/logo",
          }}
          executeDeposit={(tokenSymbol, tokenAddress, amount, _chainId, user) => {
            const contractAddress =
              "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5" as const;
            const abi: Abi = [
              {
                inputs: [
                  { internalType: "address", name: "asset", type: "address" },
                  { internalType: "uint256", name: "amount", type: "uint256" },
                  { internalType: "address", name: "onBehalfOf", type: "address" },
                  { internalType: "uint16", name: "referralCode", type: "uint16" },
                ],
                name: "supply",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
              },
            ];

            const encoded = encodeFunctionData({
              abi: abi,
              functionName: "supply",
              args: [tokenAddress, amount, user, 0],
            });

            return {
              to: contractAddress,
              data: encoded,
              tokenApproval: {
                token: tokenAddress,
                amount: amount,
                spender: contractAddress,
              },
            };
          }}
        />
      </div>
    </div>
  );
}
