import { useState } from "react";
import { createPublicClient, http, type Address, type EIP1193Provider } from "viem";

import { appKit } from "$lib/utils/appkit";
import { getBalance, getChain, getViemChainConfig } from "$lib/utils/crypto";
import { toast } from "$lib/components/core/toast";

import { pricingInfoAtom, registrationModal, tokenAddressAtom, useEventRegistrationStore } from "../store";
import { ConfirmCryptoPaymentModal } from "../modals/ConfirmCryptoPaymentModal";
import { useBuyTickets } from "./useBuyTickets";

export function useCryptoPayment() {
  const store = useEventRegistrationStore();

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

  const checkBalance = async() => {
    const tokenAddress = store.get(tokenAddressAtom);

    if (!tokenAddress) return;

    const walletProvider = appKit.getProvider('eip155') as EIP1193Provider | undefined;
    const address = appKit.getAddress();

    if (!walletProvider || !address) {
      throw new Error('Could not find wallet provider');
    }

    const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
    const chainId = typeof chainIdHex === 'string' ? parseInt(chainIdHex, 16) : Number(chainIdHex);
    const chain = getChain(chainId.toString());

    if (!chain || !chain.rpc_url) {
      throw new Error('Chain configuration not found');
    }

    const publicClient = createPublicClient({
      chain: getViemChainConfig(chain),
      transport: http(chain.rpc_url),
    });

    return getBalance({
      publicClient,
      tokenAddress,
      chainId: chain.chain_id,
      account: address as Address,
    });
  }
  
  const pay = async () => {
    try {
      setCheckBalanceLoading(true);
      const balance = await checkBalance();
      setCheckBalanceLoading(false);

      const total = store.get(pricingInfoAtom)?.total || 0;
    
      if (BigInt(balance) < BigInt(total)) {
        toast.error('Insufficient balance');
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
