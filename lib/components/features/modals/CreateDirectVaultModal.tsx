"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAtomValue } from 'jotai';
import { Eip1193Provider } from 'ethers';

import { Button, InputField, Menu, MenuItem, LabeledInput, ModalContent, modal, ErrorText, toast } from '$lib/components/core';
import { listChainsAtom } from '$lib/jotai/chains';
import { Chain, NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';
import { formatError, LemonadeRelayPaymentContract, waitForEvent, writeContract } from '$lib/utils/crypto';
import { useAppKitAccount, useAppKitProvider } from '$lib/utils/appkit';
import { useMutation } from '$lib/graphql/request';
import { CreateNewPaymentAccountDocument } from '$lib/graphql/generated/backend/graphql';
import { PaymentAccountType } from '$lib/graphql/generated/backend/graphql';

import { ProcessingTransaction } from './ProcessingTransaction';
import { ConnectWallet } from './ConnectWallet';
import { SignTransactionModal } from './SignTransaction';

interface CreateDirectVaultModalProps {
  onCreateVault?: (paymentAccount: NewPaymentAccount) => void;
}

interface FormData {
  vaultName: string;
  network: Chain;
  destinationWallet: string;
}

export function CreateDirectVaultModal({ onCreateVault }: CreateDirectVaultModalProps) {
  const { walletProvider } = useAppKitProvider('eip155');
  const { address } = useAppKitAccount();

  const chains = useAtomValue(listChainsAtom);

  const [status, setStatus] = useState<'signing' | 'activating' | 'none'>('none');

  const [createNewPaymentAccount] = useMutation(CreateNewPaymentAccountDocument);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      vaultName: '',
      network: chains[0],
      destinationWallet: '',
    },
    mode: 'onChange',
  });

  const createRelayContract = async () => {
    const data = getValues();
    const network = data.network;

    try {
      setStatus('activating');
      const transaction = await writeContract(
        LemonadeRelayPaymentContract,
        network.relay_payment_contract!,
        walletProvider as Eip1193Provider,
        'register',
        [
          [address],
          [1]
        ],
      );
  
      const parsedEventLog = await waitForEvent(transaction, LemonadeRelayPaymentContract, 'OnRegister');
      const paymentSplitter = parsedEventLog?.args?.splitter;

      if (!paymentSplitter) throw new Error('Payment splitter not found');
      
      const paymentAccountResponse = await createNewPaymentAccount({
        variables: {
          type: PaymentAccountType.EthereumRelay,
          title: data.vaultName,
          account_info: {
            currencies: network.tokens?.map(token => token.symbol),
            address,
            payment_splitter_contract: paymentSplitter,
            network: network.chain_id,
          },
        },
      });

      onCreateVault?.(paymentAccountResponse?.data?.createNewPaymentAccount as NewPaymentAccount);

      modal.close();
    } catch (error) {
      toast.error(formatError(error));
    } finally {
      setStatus('none');
    }
  };

  const onSubmit = async (data: FormData) => {
    if (data.network.relay_payment_contract) {
      modal.open(ConnectWallet, {
        props: {
          chain: data.network,
          onConnect: () => {
            setStatus('signing');
          },
        },
      });
      return;
    }
  };

  if (status === 'activating') {
    const network = getValues().network;

    return (
      <ProcessingTransaction
        imgSrc={network.logo_url || ''}
        title={`Activate ${network.name}`}
        description={`We're enabling ${network.name} chain for your vault. Hang tight while we connect everything securely.`}
      />
    );
  }

  if (status === 'signing') {
    const data = getValues();

    return (
      <SignTransactionModal
        onClose={() => setStatus('none')}
        onSign={createRelayContract}
        title={`Activate ${data.network.name}`}
        description={`Please sign the transaction to pay gas fees & activate ${data.network.name}. An approval step may appear first.`}
      />
    );
  }

  return (
    <ModalContent
      title="Create Direct Vault"
      onClose={() => modal.close()}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="vaultName"
          rules={{ required: 'Please enter a vault name' }}
          render={({ field }) => (
            <div className="space-y-2">
              <InputField
                label="Vault Name"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Enter vault name"
                error={!!errors.vaultName}
              />
              {errors.vaultName && <ErrorText message={errors.vaultName.message!} />}
            </div>
          )}
        />

        <Controller
          control={control}
          name="network"
          rules={{ required: 'Please select a network' }}
          render={({ field }) => (
            <div className="space-y-2">
              <LabeledInput label="Select Network">
                <Menu.Root>
                  <Menu.Trigger>
                    <div className="flex rounded-sm bg-primary/8 py-2 px-3.5 gap-2.5 items-center">
                      {field.value?.logo_url && (
                        <img src={field.value.logo_url} className="size-5" alt={field.value.name} />
                      )}
                      <p className="flex-1">{field.value?.name || "Select a network"}</p>
                      <i className="icon-chevron-down size-5 text-quaternary" />
                    </div>
                  </Menu.Trigger>

                  <Menu.Content className="p-1 w-full max-h-[180px] overflow-y-auto no-scrollbar">
                    {({ toggle }) =>
                      chains.map((chain) => (
                        <MenuItem
                          key={chain.chain_id}
                          title={chain.name}
                          iconLeft={chain.logo_url ? <img src={chain.logo_url} className="size-5" /> : undefined}
                          onClick={() => {
                            field.onChange(chain);
                            toggle();
                          }}
                        />
                      ))
                    }
                  </Menu.Content>
                </Menu.Root>
              </LabeledInput>
              {errors.network && <ErrorText message={errors.network.message!} />}
            </div>
          )}
        />

        <Controller
          control={control}
          name="destinationWallet"
          rules={{ required: 'Please enter a wallet address' }}
          render={({ field }) => (
            <div className="space-y-2">
              <InputField
                label="Destination Wallet Address"
                value={field.value}
                onChangeText={field.onChange}
                placeholder="0x000000..."
                error={!!errors.destinationWallet}
              />
              {errors.destinationWallet && <ErrorText message={errors.destinationWallet.message!} />}
            </div>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          variant="secondary"
        >
          Create Vault
        </Button>
      </form>
    </ModalContent>
  );
}
