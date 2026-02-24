'use client';

import { Button, Chip, drawer, modal } from "$lib/components/core";
import { AcceptWalletPaymentsModal } from "./ticket/AcceptWalletPaymentsModal";
import { NewPaymentAccount, NewPaymentProvider, PaymentAccountType } from "$lib/graphql/generated/backend/graphql";
import { useAttachStripeAccount } from "$lib/hooks/useStripeSetup";
import { useStripeSetup } from "$lib/hooks/useStripeSetup";

import { useEvent } from "./store";
import { VaultInfoDrawer } from "./drawers/VaultInfoDrawer";
import { groupPaymentAccounts } from "$lib/utils/payment";
import { PaymentNetwork } from "./common/PaymentNetwork";

export function EventPayment() {
  const event = useEvent();

  const handleCreateVault = () => {
    modal.open(AcceptWalletPaymentsModal, {
      props: { event: event! },
    });
  };

  if (!event) return null;

  const stripeAttached = event.payment_accounts_expanded?.some((vault) => vault?.provider === NewPaymentProvider.Stripe);
  const cryptoAccounts = event.payment_accounts_expanded?.filter((vault) => vault?.provider !== NewPaymentProvider.Stripe);
  const groupedCryptoAccounts = groupPaymentAccounts(cryptoAccounts as NewPaymentAccount[]);

  return (
    <div className="space-y-4">
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
    <tr >
      <td className="px-4 py-3">
        <p>Stripe</p>
      </td>
      <td className="px-4 py-3">
        <Chip className="rounded-full" variant="secondary" size="xxs">
          Direct Ticketing
        </Chip>
      </td>
      <td className="px-4 py-3">
      <i className="icon-stripe-alt size-5" />
      </td>
      <td className="px-4 py-3">
        <p className="text-tertiary">_</p>
      </td>
      {
        !connected && (
          <td className="px-4 py-3 text-right">
            <Button variant="secondary" size="xs" onClick={handleStripeSetup}>
              Connect
            </Button>
        </td>
        )
      }
    </tr>
  );
}

function VaultRow({ vaults }: { vaults: NewPaymentAccount[]; }) {
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
        <Chip className="rounded-full" variant="secondary" size="xxs">
          {vault.type === PaymentAccountType.EthereumStake ? 'Staking' : 'Direct Ticketing'}
        </Chip>
      </td>
      <td className="px-4 py-3 flex gap-3">
        {vaults.map((vault) => (
          <PaymentNetwork key={vault._id} vault={vault} />
        ))}
      </td>
      <td className="px-4 py-3">
        <p className="text-tertiary">_</p>
      </td>
      <td className="px-4 py-3 text-right">
        <i
          className="icon-edit-sharp size-5 text-tertiary cursor-pointer"
          onClick={handleEdit}
        />
      </td>
    </tr>
  );
}
