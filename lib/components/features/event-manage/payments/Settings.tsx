'use client';

import { Button, Chip, drawer, modal } from '$lib/components/core';
import { NewPaymentAccount, NewPaymentProvider, PaymentAccountType } from '$lib/graphql/generated/backend/graphql';
import { useAttachStripeAccount, useStripeSetup } from '$lib/hooks/useStripeSetup';
import { groupPaymentAccounts } from '$lib/utils/payment';
import { AcceptWalletPaymentsModal } from '$lib/components/features/event-manage/ticket/AcceptWalletPaymentsModal';
import { PaymentNetwork } from '$lib/components/features/event-manage/common/PaymentNetwork';
import { VaultInfoDrawer } from '$lib/components/features/event-manage/drawers/VaultInfoDrawer';
import { useEvent } from '$lib/components/features/event-manage/store';

export function Settings() {
  const event = useEvent();

  const handleCreateVault = () => {
    modal.open(AcceptWalletPaymentsModal, {
      props: { event: event! },
    });
  };

  if (!event) return null;

  const accounts = (event.payment_accounts_expanded ?? []).filter((v): v is NewPaymentAccount => v != null);
  const stripeAttached = accounts.some((vault) => vault.provider === NewPaymentProvider.Stripe);
  const cryptoAccounts = accounts.filter((vault) => vault.provider !== NewPaymentProvider.Stripe);
  const groupedCryptoAccounts = groupPaymentAccounts(cryptoAccounts);

  return (
    <div className="page mx-auto py-6 px-4 md:px-0 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vaults ({event.payment_accounts_new?.length || 0})</h1>
        <Button variant="tertiary" onClick={handleCreateVault} iconLeft="icon-plus" size="sm">
          Add Vault
        </Button>
      </div>

      <div className="rounded-md border border-card-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary/4">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-tertiary">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-tertiary">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-tertiary">Networks</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-tertiary">Assets</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-divider)">
            <StripeRow connected={!!stripeAttached} />
            {Object.values(groupedCryptoAccounts).map((vaults) => (
              <VaultRow key={vaults[0]?._id} vaults={vaults} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StripeRow({ connected }: { connected: boolean }) {
  const handleStripeSetup = useStripeSetup();
  useAttachStripeAccount({ skip: connected });

  return (
    <tr>
      <td className="px-4 py-3">
        <p>Stripe</p>
      </td>
      <td className="px-4 py-3">
        <Chip className="rounded-full w-fit" variant="secondary" size="xxs">
          Direct Ticketing
        </Chip>
      </td>
      <td className="px-4 py-3">
        <i aria-hidden="true" className="icon-stripe-alt size-5" />
      </td>
      <td className="px-4 py-3">
        <p className="text-tertiary">&mdash;</p>
      </td>
      <td className="px-4 py-3 text-right">
        {!connected && (
          <Button variant="secondary" size="xs" onClick={handleStripeSetup}>
            Connect
          </Button>
        )}
      </td>
    </tr>
  );
}

function VaultRow({ vaults }: { vaults: NewPaymentAccount[] }) {
  const handleEdit = () => {
    drawer.open(VaultInfoDrawer, {
      props: { vaults },
    });
  };

  const vault = vaults[0];

  return (
    <tr>
      <td className="px-4 py-3">
        <p>{vault.title || 'Untitled Vault'}</p>
      </td>
      <td className="px-4 py-3">
        <Chip className="rounded-full w-fit" variant="secondary" size="xxs">
          {vault.type === PaymentAccountType.EthereumStake ? 'Staking' : 'Direct Ticketing'}
        </Chip>
      </td>
      <td className="px-4 py-3 flex gap-3">
        {vaults.map((v) => (
          <PaymentNetwork key={v._id} vault={v} />
        ))}
      </td>
      <td className="px-4 py-3">
        <p className="text-tertiary">&mdash;</p>
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          className="icon-edit-sharp size-5 text-tertiary cursor-pointer"
          onClick={handleEdit}
          aria-label={`Edit ${vault.title || 'vault'}`}
        />
      </td>
    </tr>
  );
}
