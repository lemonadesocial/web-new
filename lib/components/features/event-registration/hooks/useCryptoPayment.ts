import { useState } from "react";
import { Eip1193Provider, ethers } from "ethers";

import { useAppKitProvider } from "$lib/utils/appkit";
import { isNativeToken } from "$lib/utils/crypto";
import { toast } from "$lib/components/core/toast";
import ERC20 from "$lib/abis/ERC20.json";
import { CancelPaymentDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request/hooks";

import { pricingInfoAtom, registrationModal, tokenAddressAtom, useEventRegistrationStore } from "../store";
import { ConfirmCryptoPaymentModal } from "../modals/ConfirmCryptoPaymentModal";
import { useBuyTickets } from "./useBuyTickets";

export function useCryptoPayment() {
  const store = useEventRegistrationStore();
  const { walletProvider } = useAppKitProvider('eip155');

  const [handleCancelPayment] = useMutation(CancelPaymentDocument);

  const { pay: handleBuyTickets, loading: buyTicketsLoading } = useBuyTickets(data => {
    registrationModal.open(ConfirmCryptoPaymentModal, {
      props: {
        paymentId: data.buyTickets.payment._id,
        paymentSecret: data.buyTickets.payment.transfer_metadata.payment_secret,
        hasJoinRequest: data.buyTickets.join_request?.state === 'pending'
      },
      onClose: () => {
        handleCancelPayment({
          variables: {
            input: {
              _id: data.buyTickets.payment._id,
              payment_secret: data.buyTickets.payment.transfer_metadata.payment_secret
            }
          }
        });
      }
    });
  });

  const [checkBalanceLoading, setCheckBalanceLoading] = useState(false);
  const loading = buyTicketsLoading || checkBalanceLoading;

  const checkBalance = async() => {
    const tokenAddress = store.get(tokenAddressAtom);

    if (!tokenAddress) return;

    const provider = new ethers.BrowserProvider(walletProvider as Eip1193Provider);
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
