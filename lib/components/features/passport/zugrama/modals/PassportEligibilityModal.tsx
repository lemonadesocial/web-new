'use client';
import { useAppKitAccount } from '$lib/utils/appkit';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { SuccessModal } from '$lib/components/features/modals/SuccessModal';
import { Button, Card, ModalContent } from '$lib/components/core';
import { formatWallet } from '$lib/utils/crypto';
import { useQuery } from '$lib/graphql/request';
import { CanMintLemonheadDocument, PassportProvider } from '$lib/graphql/generated/backend/graphql';

export function PassportEligibilityModal({ onContinue }: { onContinue: () => void }) {
  const { address } = useAppKitAccount();

  const { data, loading } = useQuery(CanMintLemonheadDocument, {
    variables: {
      wallet: address!,
      provider: PassportProvider.Zugrama,
    },
  });

  if (loading) return (
    <ConfirmTransaction
      title="Checking Your Access"
      description="We’re checking if you’re on the Zugrama whitelist. This may take a moment."
    />
  );

  if (data?.canMintLemonhead.can_mint) return (
    <SuccessModal
      title='You’re On The Whitelist!'
      description='You can now personalize your Zugrama Passport to make it truly yours before minting your on-chain identity.'
      buttonText="Continue"
      onClose={onContinue}
    />
  );

  return (
    <ModalContent>
      <div className="space-y-4">
        <div className="size-[56px] flex justify-center items-center rounded-full bg-warning-300/16">
          <i className="icon-error text-warning-300" />
        </div>
        <div className="space-y-2">
          <p className="text-lg">You’re Not on the List Yet</p>
          <p className="text-sm text-secondary">
            You’re not whitelisted to mint your Zugrama Passport yet. Register to the Zugrama Launch to secure your spot.
          </p>
        </div>

        <Card.Root className="border-none bg-none">
          <Card.Content className="justify-between flex items-center py-2 px-3">
            <div className="flex gap-3">
              <i className="icon-wallet size-5 aspect-square text-tertiary" />
              {address && <p>{formatWallet(address!)}</p>}
            </div>
            <i
              className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
              onClick={() => open()}
            />
          </Card.Content>
        </Card.Root>

        {/* <Button variant="secondary" className="w-full" onClick={() => window.open('/e/lemonheadslaunch', '_blank')}>
        View Event
      </Button> */}
      </div>
    </ModalContent>
  );
}
