import { useState } from "react";

import { useMutation } from "$lib/graphql/request";
import { Button, Input, modal, ModalContent, Select, Menu, MenuItem } from "$lib/components/core";
import { EventTicketPrice, UpdateEventPaymentAccountsDocument, type Event, NewPaymentAccount } from "$lib/graphql/generated/backend/graphql";

import { useEvent, useUpdateEvent } from "../store";
import { useMe } from "$lib/hooks/useMe";
import { CreateDirectVaultModal } from "../../modals/CreateDirectVaultModal";
import { formatCryptoPrice, getEventDirectPaymentAccounts } from "$lib/utils/event";
import { multiplyByPowerOf10 } from "$lib/utils/crypto";
import { ethers } from "ethers";

export function UpdateCryptoPriceModal({ price, onChange }: { price?: EventTicketPrice; onChange: (price: EventTicketPrice) => void }) {
  const event = useEvent();
  const updateEvent = useUpdateEvent();
  const me = useMe();
  
  const paymentAccounts = getEventDirectPaymentAccounts(event!);

  const [selectedPaymentAccount, setSelectedPaymentAccount] = useState<NewPaymentAccount | null>(price?.payment_accounts_expanded?.[0] || paymentAccounts[0]);

  const currencies = selectedPaymentAccount?.account_info.currencies || [];
  const currencyMap = selectedPaymentAccount?.account_info.currency_map || {};

  const [currency, setCurrency] = useState<string>(price?.currency || currencies[0]);
  const [cost, setCost] = useState<string>(price?.cost ? ethers.formatUnits(price.cost, currencyMap[currency].decimals) : '');


  const [updatePaymentAccount] = useMutation(UpdateEventPaymentAccountsDocument, {
    onComplete(_, data) {
      if (data?.updateEvent) {
        updateEvent(data.updateEvent as Event);
      }
    },
  });

  const handleCreateVault = () => {
    modal.close();
    modal.open(CreateDirectVaultModal, {
      props: {
        onCreateVault(paymentAccount: NewPaymentAccount) {
          if (paymentAccount._id && event) {
            setSelectedPaymentAccount(paymentAccount);

            updatePaymentAccount({
              variables: {
                id: event._id,
                payment_accounts_new: [...(event.payment_accounts_new || []), paymentAccount._id]
              }
            });
            modal.close();
          }
        },
      },
      className: 'overflow-visible',
    });
  };

  const handleUpdatePrice = () => {
    onChange({ 
      cost: multiplyByPowerOf10(cost, currencyMap[currency].decimals), 
      currency, 
      payment_accounts: selectedPaymentAccount ? [selectedPaymentAccount._id] : [], 
      payment_accounts_expanded: selectedPaymentAccount ? [selectedPaymentAccount] : [] 
    });
    modal.close();
  };

  return (
    <ModalContent icon="icon-wallet">
      <div className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <p className="text-lg">Price for Wallet</p>
          <p className="text-sm text-secondary">Charged when payment is made in crypto.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-secondary">Direct Vault</p>
          <Menu.Root>
            <Menu.Trigger>
              <div className="flex rounded-sm bg-primary/8 py-2 px-3.5 gap-2.5 items-center w-full">
                <i className="icon-account-balance size-5 text-secondary" />
                <p className="flex-1">{selectedPaymentAccount?.title || "Select a vault"}</p>
                <i className="icon-chevron-down size-5 text-quaternary" />
              </div>
            </Menu.Trigger>

            <Menu.Content className="p-1 w-full max-h-[180px] overflow-y-auto no-scrollbar">
              {({ toggle }) => (
                <>
                  {paymentAccounts.map(account => account && (
                    <MenuItem
                      key={account._id}
                      title={account.title || 'Untitled Vault'}
                      iconLeft="icon-account-balance"
                      onClick={() => {
                        setSelectedPaymentAccount(account as NewPaymentAccount);
                        toggle();
                      }}
                    />
                  ))}
                  <div className="border-t border-primary/8 my-1" />
                  <MenuItem
                    title="New Vault"
                    iconLeft="icon-plus"
                    onClick={() => {
                      toggle();
                      handleCreateVault();
                    }}
                  />
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Ticket Price</p>

          <div className="grid grid-cols-2">
            <Input
              value={cost}
              onChange={e => setCost(e.target.value)}
              placeholder="Enter a price"
              variant="outlined"
              className="rounded-r-none"
            />
            <Select
              value={currency}
              onChange={value => setCurrency(value as string)}
              options={currencies}
              placeholder="Select a currency"
              className="rounded-l-none"
              removeable={false}
            />
          </div>
        </div>
        
        <Button variant="secondary" className="w-full" onClick={handleUpdatePrice}>
          Update Price
        </Button>
      </div>
    </ModalContent>
  )
}
