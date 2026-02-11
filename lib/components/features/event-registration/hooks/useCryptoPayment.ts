import { useState } from "react";
import { Eip1193Provider, ethers } from "ethers";
import type { EthereumProvider } from "@avail-project/nexus-core";
import { useAccount } from "wagmi";
import { useAtomValue as useJotaiAtomValue } from "jotai";
import { type Hex } from "viem";

import { appKit } from "$lib/utils/appkit";
import { isNativeToken } from "$lib/utils/crypto";
import { toast } from "$lib/components/core/toast";
import ERC20 from "$lib/abis/ERC20.json";
import { chainsMapAtom } from "$lib/jotai";
import { EthereumAccount } from "$lib/graphql/generated/backend/graphql";

import { pricingInfoAtom, registrationModal, tokenAddressAtom, currencyAtom, selectedPaymentAccountAtom, useEventRegistrationStore } from "../store";
import { ConfirmCryptoPaymentModal } from "../modals/ConfirmCryptoPaymentModal";
import { InsufficientBalanceSwapModal } from "../../modals/InsufficientBalanceSwapModal";
import { useBuyTickets } from "./useBuyTickets";
import { useNexus } from "$lib/components/features/avail/NexusProvider";
import { modal } from "$lib/components/core";

export function useCryptoPayment() {
  const store = useEventRegistrationStore();
  const { connector } = useAccount();
  const { handleInit } = useNexus();
  const chainsMap = useJotaiAtomValue(chainsMapAtom);

  const { pay: handleBuyTickets, loading: buyTicketsLoading } = useBuyTickets(data => {
    registrationModal.open(ConfirmCryptoPaymentModal, {
      props: {
        paymentId: data.buyTickets.payment._id,
        paymentSecret: data.buyTickets.payment.transfer_metadata.payment_secret,
        hasJoinRequest: data.buyTickets.join_request?.state === 'pending'
      },
      dismissible: false
    });
  });

  const [checkBalanceLoading, setCheckBalanceLoading] = useState(false);
  const loading = buyTicketsLoading || checkBalanceLoading;

  const checkBalance = async () => {
    const tokenAddress = store.get(tokenAddressAtom);

    if (!tokenAddress) return;

    const provider = new ethers.BrowserProvider(appKit.getProvider('eip155') as Eip1193Provider);
    const network = await provider.getNetwork();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    if (isNativeToken(tokenAddress, network.chainId.toString())) {
      return provider.getBalance(address);
    }

    const erc20Token = new ethers.Contract(tokenAddress, ERC20, signer);
    return await erc20Token.balanceOf(address);
  }

  const pay = async () => {
    try {
      setCheckBalanceLoading(true);
      const balance = await checkBalance();
      setCheckBalanceLoading(false);

      const total = store.get(pricingInfoAtom)?.total || 0;

      if (BigInt(balance) < BigInt(total)) {
        const provider = connector
          ? await connector.getProvider()
          : appKit.getProvider("eip155");
        if (provider) {
          handleInit(provider as EthereumProvider);
        }

        const currency = store.get(currencyAtom);
        const tokenAddress = store.get(tokenAddressAtom);
        const selectedPaymentAccount = store.get(selectedPaymentAccountAtom);

        const network = (selectedPaymentAccount?.account_info as EthereumAccount)?.network;
        const chain = network ? chainsMap[network] : null;
        const toChainId = Number(chain?.chain_id ?? 0);
        const toTokenAddress = (tokenAddress as Hex) ?? ('0x' as Hex);
        const token = chain?.tokens?.find(
          (t) => t.contract?.toLowerCase() === tokenAddress?.toLowerCase()
        );
        const tokenDecimals = token?.decimals ?? 18;

        const shortfall = BigInt(total) - BigInt(balance);
        modal.open(InsufficientBalanceSwapModal, {
          props: {
            currentBalance: String(balance),
            neededAmount: String(shortfall),
            currency: currency || "",
            toChainId,
            toTokenAddress,
            tokenDecimals,
            onSuccess: pay,
          },
        });
        return;
      }

      handleBuyTickets();
    } catch {
      toast.error('Failed to check balance. Proceeding with payment anyway.');
      handleBuyTickets();
    } finally {
      setCheckBalanceLoading(false);
    }
  }

  return { pay, loading };
}
