import { useState } from "react";
import { useAtomValue as useJotaiAtomValue } from "jotai";
import { Eip1193Provider } from "ethers";
import * as Sentry from '@sentry/nextjs';

import { Button, ModalContent } from "$lib/components/core";
import { EthereumAccount, EthereumRelayAccount, EthereumStakeAccount, UpdatePaymentDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { appKit, useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { approveERC20Spender, formatError, formatWallet, isNativeToken, LemonadeRelayPaymentContract, LemonadeStakePaymentContract, transfer, writeContract } from "$lib/utils/crypto";
import { chainsMapAtom } from "$lib/jotai";

import { eventDataAtom, pricingInfoAtom, registrationModal, selectedPaymentAccountAtom, tokenAddressAtom, useAtomValue } from "../store";
import { VerifyingTransactionModal } from "./VerifyingTransactionModal";
import { ErrorModal } from "../../modals/ErrorModal";

interface PaymentProcessingModalProps {
  paymentId: string;
  paymentSecret?: string;
  hasJoinRequest: boolean;
}

export function ConfirmCryptoPaymentModal({ paymentId, paymentSecret, hasJoinRequest }: PaymentProcessingModalProps) {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const event = useAtomValue(eventDataAtom);
  const selectedPaymentAccount = useAtomValue(selectedPaymentAccountAtom);
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const network = (selectedPaymentAccount!.account_info as EthereumAccount)!.network;
  const chain = useJotaiAtomValue(chainsMapAtom)[network];
  const tokenAddress = useAtomValue(tokenAddressAtom)!;

  const paymentAccount = selectedPaymentAccount ? pricingInfo?.payment_accounts?.find(account => account._id === selectedPaymentAccount._id) : pricingInfo?.payment_accounts?.[0];
  const paymentAccountInfo = paymentAccount?.account_info as (EthereumAccount | EthereumRelayAccount | EthereumStakeAccount);
  const payAmount = paymentAccount && pricingInfo ? BigInt(pricingInfo.total) + BigInt(paymentAccount.fee || 0) : BigInt(0);

  const [handleUpdatePayment, { loading: loadingUpdatePayment }] = useMutation(UpdatePaymentDocument);
  const [loadingSign, setLoadingSign] = useState(false);
  const [error, setError] = useState('');

  const approveERC20Payment = async (contract: string) => {
    if (isNativeToken(tokenAddress, network)) return;
    await approveERC20Spender(tokenAddress, contract, payAmount, walletProvider as Eip1193Provider);
  };

  const onSign = async () => {
    setError('');

    await handleUpdatePayment({
      variables: {
        input: {
          _id: paymentId,
          payment_secret: paymentSecret,
          transfer_params: {
            from: address!,
            network,
          }
        }
      }
    });

    try {
      setLoadingSign(true);

      if (paymentAccount?.relay && chain?.relay_payment_contract) {
        await approveERC20Payment(chain.relay_payment_contract);

        const transaction = await writeContract(
          LemonadeRelayPaymentContract,
          chain.relay_payment_contract,
          walletProvider as Eip1193Provider,
          'pay',
          [
            paymentAccount.relay.payment_splitter_contract,
            event._id,
            paymentId,
            tokenAddress,
            payAmount.toString(),
          ],
          { value: isNativeToken(tokenAddress, network) ? payAmount.toString() : 0 }
        );

        await handleConfirm(transaction.hash);

        return;
      }

      if (paymentAccount?.type === 'ethereum_stake' && chain?.stake_payment_contract) {
        await approveERC20Payment(chain.stake_payment_contract);

        const transaction = await writeContract(
          LemonadeStakePaymentContract,
          chain.stake_payment_contract,
          walletProvider as Eip1193Provider,
          'stake',
          [
            (paymentAccountInfo as EthereumStakeAccount).config_id,
            event._id,
            paymentId,
            tokenAddress,
            payAmount.toString(),
          ],
          { value: isNativeToken(tokenAddress, network) ? payAmount.toString() : 0 }
        );

        await handleConfirm(transaction.hash);

        return;
      }

      const toAddress = paymentAccountInfo.address;
      const txHash = await transfer(toAddress, (pricingInfo?.total || 0).toString(), tokenAddress, walletProvider as Eip1193Provider, network);

      await handleConfirm(txHash);
    } catch (e) {
      Sentry.captureException(e, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
          paymentId,
        },
      });
      
      setError(formatError(e));
    } finally {
      setLoadingSign(false);
    }
  };

  const handleConfirm = async (txHash: string) => {
    try {
      if (!txHash) {
        throw new Error('Failed to get transaction hash');
      }
  
      await handleUpdatePayment({
        variables: {
          input: {
            _id: paymentId,
            payment_secret: paymentSecret,
            transfer_params: {
              tx_hash: txHash,
            }
          }
        }
      });
  
      registrationModal.close();
  
      registrationModal.open(VerifyingTransactionModal, {
        props: {
          paymentId,
          paymentSecret,
          txHash,
          hasJoinRequest
        },
        dismissible: false
      });
    } catch (e) {
      Sentry.captureException(e);
      setError(formatError(e));
    }
  };

  if (error) return (
    <ErrorModal
      title="Transaction Failed"
      message={error}
      onRetry={onSign}
      onClose={() => registrationModal.close()}
    />
  );

  return (
    <ModalContent title="Confirm Crypto Payment" onClose={() => registrationModal.close()}>
      <div className="space-y-2">
        <div className="flex gap-3">
          <div className="size-[34px] flex justify-center items-center rounded-full bg-primary/8">
            <i aria-hidden="true" className="icon-wallet text-tertiary size-[18px]" />
          </div>
          <div className="space-y-[2px]">
            <p className="text-xs text-tertiary">Connected Wallet</p>
            <p>{formatWallet(address!)}</p>
          </div>
        </div>
        <p>
          Please sign the transaction to proceed with the payment. An approval step may appear first.
        </p>
      </div>
      <Button
        className="w-full mt-4"
        variant="secondary"
        onClick={onSign}
        loading={loadingUpdatePayment}
        disabled={loadingSign}
      >
        {loadingSign ? 'Waiting for Signature...' : 'Sign Transaction'}
      </Button>
    </ModalContent>
  );
}
