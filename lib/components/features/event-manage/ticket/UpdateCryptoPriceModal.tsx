import { useState, useMemo } from "react";

import { Button, Input, modal, ModalContent, Select, Menu, MenuItem } from "$lib/components/core";
import { EventTicketPrice, NewPaymentAccount } from "$lib/graphql/generated/backend/graphql";

import { useEvent } from "../store";
import { CreateDirectVaultModal } from "../../modals/CreateDirectVaultModal";
import { getEventDirectPaymentAccounts } from "$lib/utils/event";
import { multiplyByPowerOf10 } from "$lib/utils/crypto";
import { formatUnits } from "viem";
import { useUpdateEventPaymentAccounts } from "../hooks";
import { groupPaymentAccounts } from "$lib/utils/payment";

export function UpdateCryptoPriceModal({ price, onChange }: { price?: EventTicketPrice; onChange: (price: EventTicketPrice) => void }) {
  const event = useEvent();
  const { addAccount } = useUpdateEventPaymentAccounts();
  
  const paymentAccounts = getEventDirectPaymentAccounts(event!);
  const groupedPaymentAccounts = groupPaymentAccounts(paymentAccounts as NewPaymentAccount[]);
  const paymentAccountList = Object.values(groupedPaymentAccounts);

  const [selectedPaymentAccounts, setSelectedPaymentAccounts] = useState<NewPaymentAccount[] | null>(price?.payment_accounts_expanded || paymentAccountList[0]);

  const { currencies, currencyMap } = useMemo(() => {
    if (!selectedPaymentAccounts) return { currencies: [], currencyMap: {} };

    const currencies = new Set<string>();
    const currencyMap = {} as Record<string, any>;

    selectedPaymentAccounts.forEach(account => {
      const accountInfo = account.account_info as any;
      
      if (accountInfo.currencies) {
        accountInfo.currencies.forEach((currency: string) => {
          currencies.add(currency);
        });
      }
      
      if (accountInfo.currency_map) {
        Object.assign(currencyMap, accountInfo.currency_map);
      }
    });

    return {
      currencies: Array.from(currencies),
      currencyMap
    };
  }, [selectedPaymentAccounts]);

  const [currency, setCurrency] = useState<string>(price?.currency || currencies[0]);
  const [cost, setCost] = useState<string>(price?.cost ? formatUnits(BigInt(price.cost), currencyMap[currency]?.decimals || 18) : '');

  const handleCreateVault = () => {
    modal.open(CreateDirectVaultModal, {
      props: {
        onCreateVault(paymentAccount: NewPaymentAccount) {
          if (paymentAccount._id && event) {
            setSelectedPaymentAccounts([paymentAccount]);

            addAccount(paymentAccount._id);
          }
        },
      },
      className: 'overflow-visible',
    });
  };

  const handleUpdatePrice = () => {
    onChange({ 
      cost: multiplyByPowerOf10(cost, currencyMap[currency]?.decimals), 
      currency, 
      payment_accounts: selectedPaymentAccounts ? selectedPaymentAccounts.map(account => account._id) : [], 
      payment_accounts_expanded: selectedPaymentAccounts || [] 
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
                <p className="flex-1 truncate">{selectedPaymentAccounts?.[0]?.title || "Select a vault"}</p>
                <i className="icon-chevron-down size-5 text-quaternary" />
              </div>
            </Menu.Trigger>

            <Menu.Content className="p-1 w-full max-h-[180px] overflow-y-auto no-scrollbar">
              {({ toggle }) => (
                <>
                  {paymentAccountList.map(accounts => {
                    const account = accounts[0];

                    return (
                      <MenuItem
                        key={account._id}
                        title={account.title || 'Untitled Vault'}
                        iconLeft="icon-account-balance"
                        onClick={() => {
                          setSelectedPaymentAccounts(accounts);
                          toggle();
                        }}
                      />
                    )
                  })}
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
              placeholder="Token"
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
