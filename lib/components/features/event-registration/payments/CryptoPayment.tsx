import { useAtomValue as useJotaiAtomValue } from "jotai";

import { LabeledInput, Menu, MenuItem } from "$lib/components/core";
import { EthereumAccount, NewPaymentAccount } from "$lib/generated/backend/graphql";
import { chainsMapAtom } from "$lib/jotai";

import { selectedPaymentAccountAtom, useAtom } from "../store";
import { ChainDisplay } from "../../ChainDislay";

export function CryptoPayment({ accounts }: { accounts: NewPaymentAccount[] }) {
  const [selectedPaymentAccount, setSelectedPaymentAccount] = useAtom(selectedPaymentAccountAtom);

  return <>
    <LabeledInput label="Preferred Network">
      <Menu.Root>
        <Menu.Trigger>
          {({ toggle }) => (
            <div
              className="w-full rounded-sm px-2.5 h-10 flex justify-between items-center gap-1.5 bg-primary/8"
              onClick={() => toggle()}
            >
              {selectedPaymentAccount ? <CryptoAccount account={selectedPaymentAccount} /> : <p className="text-secondary">Select a network</p>}
              <i className="icon-arrow-down size-5 text-quaternary" />
            </div>
          )}
        </Menu.Trigger>
        <Menu.Content className="p-0 min-w-[372px]">
          {({ toggle }) => (
            <div className="p-1">
              {
                accounts.map(account => (
                  <MenuItem
                    key={account._id}
                    onClick={() => {
                      setSelectedPaymentAccount(account);
                      toggle();
                    }}
                  >
                    <CryptoAccount account={account} size="sm" />
                  </MenuItem>
                ))
              }
            </div>
          )}
        </Menu.Content>
      </Menu.Root>
    </LabeledInput>
  </>;
}

function CryptoAccount({ account, size = 'md' }: { account: NewPaymentAccount; size?: 'sm' | 'md' }) {
  const chainsMap = useJotaiAtomValue(chainsMapAtom);
  const network = chainsMap[(account.account_info as EthereumAccount).network];

  if (!network) return;

  return <ChainDisplay chain={network} size={size} />;
}
