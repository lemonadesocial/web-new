import { ModalContent } from "$lib/components/core";
import { Ticket } from "$lib/graphql/generated/backend/graphql";
import { ASSET_PREFIX } from '$lib/utils/constants';
import { getTicketPassUrl } from "$lib/utils/event";

export function AddToWalletModal({ ticket  }: { ticket: Ticket }) {
  return (
    <ModalContent icon="icon-wallet-sharp">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Add to Wallet</p>
          <p className="text-sm text-secondary">Save your ticket to your mobile wallet for quick access at the event.</p>
        </div>

        <div className="flex justify-between">
          <a href={getTicketPassUrl(ticket, 'apple')} target="_blank">
            <img src={`${ASSET_PREFIX}/assets/images/add-to-apple-wallet.png`} className="h-[44px]" alt="Add to Apple Wallet" />
          </a>
          <a href={getTicketPassUrl(ticket, 'google')} target="_blank">
            <img src={`${ASSET_PREFIX}/assets/images/add-to-google-wallet.png`} className="h-[44px]" alt="Add to Google Wallet" />
          </a>
        </div>
      </div>
    </ModalContent>
  );
}
