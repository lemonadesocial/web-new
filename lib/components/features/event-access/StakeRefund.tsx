import { useState } from "react";
import { format } from "date-fns";
import { Eip1193Provider } from "ethers";

import { EthereumStakeAccount, PaymentAccountInfo, PaymentRefundInfo, PaymentRefundSignature } from '$lib/graphql/generated/backend/graphql';
import { formatWallet, getChain, LemonadeStakePaymentContract } from "$lib/utils/crypto";
import { useClient } from "$lib/graphql/request";
import { GetPaymentRefundSignatureDocument } from "$lib/graphql/generated/backend/graphql";
import { toast, Button, modal, ModalContent } from "$lib/components/core";
import { getErrorMessage } from '$lib/utils/error';
import { useAppKitAccount } from "$lib/utils/appkit";
import { useAppKitProvider } from "$lib/utils/appkit";
import { writeContract } from "$lib/utils/crypto";
import { getDisplayPrice } from "$lib/utils/event";

import { ConnectWallet } from "../modals/ConnectWallet";
import { SignTransactionModal } from "../modals/SignTransaction";
import { ConfirmTransaction } from "../modals/ConfirmTransaction";
import { SuccessModal } from "../modals/SuccessModal";

export function StakeRefundItem({ payment }: { payment: PaymentRefundInfo; }) {
  const { refund_policy, refund_requirements_met, payment_account } = payment;
  const chain = getChain((payment_account.account_info as EthereumStakeAccount).network);
  const { requirements, percent } = refund_policy!;
  const checkInRequirement = format(new Date(requirements?.checkin_before), 'EEEE, MMMM dd, h:mm a');

  const formattedAmount = getDisplayPrice(
    payment.refund_info?.available_amount || '0',
    payment.currency,
    payment_account as PaymentAccountInfo
  );

  const onClickClaim = () => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          modal.close();
          setTimeout(() => {
            modal.open(ClaimStakeModal, {
              props: { payment },
            });
          });
        },
        chain
      },
    });
  };

  if (payment.state === 'refunded') return (
    <div>
      <div>Stake Claimed</div>
      <div className="text-sm text-secondary">You&apos;ve claimed {formattedAmount} ({percent}%) for checking in on time.</div>
    </div>
  );

  if (refund_requirements_met) return (
    <div className="flex justify-between items-center">
      <div>
        <div>Eligible to Claim Stake</div>
        <div className="text-sm text-secondary">You checked in on time! Claim {percent}% from your stake</div>
      </div>
      <Button
        onClick={onClickClaim}
        iconLeft="icon-money-bag"
        size="sm"
      >
        Claim Stake
      </Button>
    </div>
  );

  if (refund_requirements_met === false) return (
    <div>
      <div>Stake Locked</div>
      <div className="text-sm text-secondary">The deadline has passed — you missed the window to claim your stake</div>
    </div>
  );

  return (
    <div>
      <div>Unlock Your Stake</div>
      <div className="text-sm text-secondary">Check in before {checkInRequirement} to get {percent}% back</div>
    </div>
  );
}

function ClaimStakeModal({ payment }: { payment: PaymentRefundInfo; }) {
  const { client } = useClient();
  const { address } = useAppKitAccount();

  const [isLoading, setIsLoading] = useState(false);

  const continueClaim = async () => {
    try {
      setIsLoading(true);

      const { data } = await client.query({
        query: GetPaymentRefundSignatureDocument,
        variables: {
          id: payment._id
        }
      });

      if (!data?.getPaymentRefundSignature) {
        throw new Error('Failed to get refund signature');
      }

      modal.close();

      modal.open(SignClaimStakeTransactionModal, {
        props: { signature: data.getPaymentRefundSignature, payment },
      });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContent icon="icon-send-money">
      <div className="space-y-4">
        <div>
        <p className="text-lg">Claim Stake</p>
        <p className="mt-2 text-secondary">
          Here&apos;s your refund summary. It will be sent to your connected wallet.
        </p>
        </div>
        <div className="rounded-md border border-divider bg-card">
          <div className="px-3.5 py-2.5 space-y-1">
            <p className="text-sm text-tertiary">Refund Details</p>
            <div className="flex items-center justify-between">
              <p className="text-sm">Stake refund ({payment.refund_policy?.percent}%)</p>
              {/* <p className="text-sm text-text-tertiary">
                {payment.refund_info?.available_amount}
              </p> */}
            </div>
          </div>
        </div>
        <div className="rounded-sm border border-divider px-3 py-2 bg-woodsmoke-950/[0.64] gap-2.5 flex items-center">
          <i className="icon-wallet size-5 text-tertiary" />
          <p>{formatWallet(address!)}</p>
        </div>
        <Button
          onClick={continueClaim}
          className="w-full"
          variant="secondary"
          loading={isLoading}
        >
          Continue
        </Button>
      </div>
    </ModalContent>
  )
}

function SignClaimStakeTransactionModal({ signature, payment }: { 
  signature: PaymentRefundSignature;
  payment: PaymentRefundInfo;
}) {
  const { walletProvider } = useAppKitProvider('eip155');
  const [status, setStatus] = useState<'signing' | 'confirming' | 'success' | 'none'>('none');

  const handleRefund = async () => {
    try {
      setStatus('signing');
      
      const contractAddress = (payment.payment_account?.account_info as EthereumStakeAccount).address;
      const { args, signature: sig } = signature;
      
      const transaction = await writeContract(
        LemonadeStakePaymentContract,
        contractAddress,
        walletProvider as Eip1193Provider,
        'refund',
        [...args, sig]
      );

      setStatus('confirming');

      await transaction.wait();

      setStatus('success');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      setStatus('none');
    }
  };

  if (status === 'success') {
    return (
      <SuccessModal 
        title="Stake Claimed!"
        description="You’ve successfully claimed your stake. The data will be updated shortly."
      />
    );
  }

  if (status === 'confirming') {
    return (
      <ConfirmTransaction 
        title="Confirming Transaction" 
        description="Please wait while your transaction is being confirmed on the blockchain."
      />
    );
  }

  return (
    <SignTransactionModal
      title="Claim Stake"
      onClose={() => modal.close()}
      description="Please sign the transaction to pay gas fees & claim your stake."
      onSign={handleRefund}
      loading={status === 'signing'}
    />
  );
}
