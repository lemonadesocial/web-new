'use client';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { parseEventLogs, type Address, type EIP1193Provider } from 'viem';

import { modal, ModalContent, toast } from '$lib/components/core';
import { Chain, CreateNewPaymentAccountDocument, EthereumAccount, NewPaymentAccount, PaymentAccountType } from '$lib/graphql/generated/backend/graphql';
import { listChainsAtom } from '$lib/jotai';
import { ProcessingTransaction } from '../../modals/ProcessingTransaction';
import { SignTransactionModal } from '../../modals/SignTransaction';
import { useMutation } from '$lib/graphql/request';
import { createViemClients } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
import LemonadeRelayPayment from '$lib/abis/LemonadeRelayPayment.json';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ConnectWallet } from '../../modals/ConnectWallet';
import { useUpdateEventPaymentAccounts } from '../hooks';

interface AddNetworkModalProps {
  vault: NewPaymentAccount;
}

export function AddNetworkModal({ vault }: AddNetworkModalProps) {
  const listChains = useAtomValue(listChainsAtom);
  const currentNetwork = (vault.account_info as EthereumAccount).network;
  const { walletProvider } = useAppKitProvider('eip155');
  const { address } = useAppKitAccount();
  const { addAccount } = useUpdateEventPaymentAccounts();

  const [createNewPaymentAccount, { loading }] = useMutation(CreateNewPaymentAccountDocument, {
    onComplete: (_, data) => {
      if (data?.createNewPaymentAccount) {
        addAccount(data.createNewPaymentAccount._id);
      }

      modal.close();
      toast.success('Network added successfully');
    },
  });

  const createRelayContract = async () => {
    try {
      setStatus('activating');
      if (!walletProvider || !selectedNetwork || !address) {
        throw new Error('Wallet not connected');
      }

      const { walletClient, publicClient, account } = await createViemClients(
        selectedNetwork.chain_id,
        walletProvider as EIP1193Provider,
      );

      const hash = await walletClient.writeContract({
        abi: LemonadeRelayPayment.abi,
        address: selectedNetwork.relay_payment_contract! as Address,
        functionName: 'register',
        args: [
          [address],
          [1],
        ],
        account,
        chain: walletClient.chain,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const registerEvents = parseEventLogs({
        abi: LemonadeRelayPayment.abi as any,
        eventName: 'OnRegister',
        logs: receipt.logs,
      });
      const paymentSplitter = (registerEvents[0] as any)?.args?.splitter as string | undefined;

      if (!paymentSplitter) throw new Error('Payment splitter not found');
      
      createNewPaymentAccount({
        variables: {
          type: PaymentAccountType.EthereumRelay,
          title: vault.title,
          account_info: {
            currencies: selectedNetwork!.tokens?.map(token => token.symbol),
            address,
            payment_splitter_contract: paymentSplitter,
            network: selectedNetwork!.chain_id,
          },
        },
      });
    } catch (error) {
      toast.error(formatError(error));
    } finally {
      setStatus('none');
    }
  };

  const networks = listChains.filter(chain => {
    if (chain.chain_id === currentNetwork) return false;
    if (vault.type === 'ethereum_stake') return !!chain.stake_payment_contract;
    if (vault.type === 'ethereum_relay') return !!chain.relay_payment_contract;
    return true;
  });

  const [selectedNetwork, setSelectedNetwork] = useState<Chain | null>(null);
  const [status, setStatus] = useState<'signing' | 'activating' | 'none'>('none');
  
  const handleNetworkClick = (network: Chain) => {
    setSelectedNetwork(network);

    if (vault.type === 'ethereum_relay') {
      modal.open(ConnectWallet, {
        props: {
          chain: network,
          onConnect: () => {
            setStatus('signing');
          },
        },
      });
      return;
    }

    createNewPaymentAccount({
      variables: {
        type: vault.type,
        title: vault.title,
        account_info: {
          currencies: network.tokens?.map(token => token.symbol),
          address,
          network: network.chain_id,
        },
      },
    });
  };

  if ((status === 'activating' || loading) && selectedNetwork) return (
    <ProcessingTransaction
      imgSrc={selectedNetwork.logo_url || ''}
      title={`Activate ${selectedNetwork.name}`}
      description={`We're enabling ${selectedNetwork.name} chain for your vault. Hang tight while we connect everything securely.`}
    />
  );

  if (status === 'signing' && selectedNetwork) return (
    <SignTransactionModal
      onClose={() => setStatus('none')}
      onSign={createRelayContract}
      title={`Activate ${selectedNetwork.name}`}
      description={`Please sign the transaction to pay gas fees & activate ${selectedNetwork.name}. An approval step may appear first.`}
    />
  );

  return (
    <ModalContent>
      <div className="flex flex-col gap-4">
        <div className="size-14 rounded-full bg-primary/8 flex items-center justify-center">
          <i className="size-8 text-tertiary icon-plus" />
        </div>
        <div>
          <p className="text-lg">Add Network</p>
          <p className="text-lg text-secondary">{vault.title || 'Untitled Vault'}</p>
        </div>

        <div className="flex flex-col gap-2">
          {networks.map((network) => (
            <button
              key={network.name}
              onClick={() => handleNetworkClick(network)}
              className="flex items-center py-1.5 px-3 gap-3 rounded-sm bg-primary/8 hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <img src={network.logo_url || ''} alt={network.name} className="size-5" />
              <p className="flex-1 text-left">{network.name}</p>
              <i className="icon-chevron-right size-4 text-quaternary" />
            </button>
          ))}
        </div>
      </div>
    </ModalContent>
  );
}
