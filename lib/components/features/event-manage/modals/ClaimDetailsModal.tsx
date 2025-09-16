'use client';
import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';
import { Eip1193Provider } from 'ethers';

import { ModalContent, Button, Skeleton, toast, modal } from '$lib/components/core';
import { EthereumAccount, EthereumRelayAccount, NewPaymentAccount, Token } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import PaymentSplitterABI from '$lib/abis/PaymentSplitter.json';
import { useRelayPayee } from '$lib/hooks/useRelayPayee';
import { writeContract, formatError } from '$lib/utils/crypto';

import { ProcessingTransaction } from '../../modals/ProcessingTransaction';
import { SignTransactionModal } from '../../modals/SignTransaction';
import { ConnectWallet } from '../../modals/ConnectWallet';
import { formatWallet } from '$lib/utils/crypto';
import { SuccessModal } from '../../modals/SuccessModal';
import { useAppKitProvider } from '$lib/utils/appkit';

interface ClaimDetailsModalProps {
  vault: NewPaymentAccount;
  onClose: () => void;
}

interface AssetInfo {
  token: Token;
  amount: bigint;
}

export function ClaimDetailsModal({ vault, onClose }: ClaimDetailsModalProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const [assetMap, setAssetMap] = useState<AssetInfo[]>([]);
  const [tokenAddresses, setTokenAddresses] = useState<string[]>([]);
  const [loadingAmounts, setLoadingAmounts] = useState(true);
  const [status, setStatus] = useState<'connecting' | 'signing' | 'processing' | 'success' | 'none'>('none');

  const network = (vault.account_info as EthereumAccount).network;
  const chain = chainsMap[network];
  const accountInfo = vault.account_info as EthereumRelayAccount;
  const { walletProvider } = useAppKitProvider('eip155');
  
  const { payee, loading: payeeLoading } = useRelayPayee(accountInfo);

  useEffect(() => {
    if (payee) {
      fetchTokenData();
    }
  }, [payee]);

  const fetchTokenData = async () => {
    setLoadingAmounts(true);
    
    if (!chain || !accountInfo.payment_splitter_contract || !payee) {
      setLoadingAmounts(false);
      return;
    }
    
    try {
      const currencies = accountInfo.currencies || [];
      const currencyMap = accountInfo.currency_map || {};
      
      const tokenAddresses = currencies.map(symbol => {
        const tokenData = currencyMap[symbol];
        return tokenData?.contracts?.[network];
      });

      if (tokenAddresses.length === 0) {
        setLoadingAmounts(false);
        return;
      }

      const provider = new ethers.JsonRpcProvider(chain.rpc_url);
      const paymentSplitter = new ethers.Contract(
        accountInfo.payment_splitter_contract, 
        PaymentSplitterABI.abi,
        provider
      );

      const pendingAmounts = await paymentSplitter['pending(address[],address)'](tokenAddresses, payee);

      const assets: AssetInfo[] = [];
      const positiveTokenAddresses: string[] = [];

      currencies.forEach((symbol, index) => {
        const token = chain.tokens?.find(t => t.symbol === symbol);
        const amount = BigInt(pendingAmounts[index]);
        
        if (token) {
          assets.push({
            token,
            amount
          });
          
          if (amount > BigInt(0)) {
            positiveTokenAddresses.push(tokenAddresses[index]);
          }
        }
      });

      setAssetMap(assets);
      setTokenAddresses(positiveTokenAddresses);
    } catch (error) {
      console.log(error)
      setAssetMap([]);
      setTokenAddresses([]);
    } finally {
      setLoadingAmounts(false);
    }
  };

  const executeClaim = async () => {
    try {
      const paymentSplitterContract = new ethers.Contract(
        ethers.ZeroAddress,
        PaymentSplitterABI.abi
      );

      const transaction = await writeContract(
        paymentSplitterContract,
        accountInfo.payment_splitter_contract!,
        walletProvider as Eip1193Provider,
        'release(address[],address)',
        [tokenAddresses, payee]
      );

      setStatus('processing');
      await transaction.wait();

      setStatus('success');
    } catch (error) {
      toast.error(formatError(error));
      setStatus('none');
    }
  };

  const handleClaim = () => {
    modal.open(ConnectWallet, {
      props: {
        chain: chain,
        onConnect: () => {
          setStatus('signing');
        },
      },
    });
  };

  const hasAssetsToClaim = tokenAddresses.length > 0;
  const isLoading = loadingAmounts || payeeLoading;

  if (status === 'processing') {
    return (
      <ProcessingTransaction
        imgSrc={chain?.logo_url || ''}
        title="Processing Your Claim"
        description={`Please wait while we confirm your transaction on ${chain.name}. This may take a moment.`}
      />
    );
  }

  if (status === 'signing') {
    return (
      <SignTransactionModal
        onClose={() => setStatus('none')}
        onSign={executeClaim}
        title="Claim Funds"
        description={`Please sign the transaction to pay gas fees & claim funds on ${chain.name}.`}
      />
    );
  }

  if (status === 'success') {
    return (
      <SuccessModal
        title="Claim Successful"
        description={`You've successfully claimed assets from ${chain.name}. Funds are now in your wallet.`}
      />
    );
  }

  return (
    <ModalContent
      onClose={onClose}
      onBack={onClose}
      title="Claim Details"
    >
      <div className="space-y-4">
        <div className="rounded-sm border bg-card">
          <div className="flex items-center justify-between px-3.5 py-2.5">
            <span className="text-sm">Network</span>
            <span className="text-sm">{chain?.name}</span>
          </div>
          <hr className="border-t border-t-divider" />
           <div className="px-3.5 py-2.5 flex flex-col gap-1">
             <span className="text-sm text-tertiary">Assets</span>
             {isLoading ? (
               <div className="space-y-2">
                 <Skeleton className="h-6 w-full" />
                 <Skeleton className="h-6 w-full" />
                 <Skeleton className="h-6 w-full" />
               </div>
             ) : (
               assetMap.map((asset, index) => (
                 <div key={index} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <img src={asset.token.logo_url || ''} alt={asset.token.symbol} className="size-4" />
                     <p className="text-sm">{asset.token.symbol}</p>
                   </div>
                   <p className="text-sm text-tertiary">{ethers.formatUnits(asset.amount, asset.token.decimals)}</p>
                 </div>
               ))
             )}
           </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Destination Address</p>
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-sm bg-primary/8">
            <i className="icon-wallet text-tertiary size-5" />
            {
              payee 
              ? <p>{formatWallet(payee)}</p>
              : <Skeleton className="h-5 w-full" />
            }
          </div>
        </div>

        <Button
          onClick={handleClaim}
          className="w-full"
          variant="secondary"
          disabled={!hasAssetsToClaim}
        >
           {hasAssetsToClaim ? 'Claim' : 'No pending funds'}
        </Button>
      </div>
    </ModalContent>
  );
}
