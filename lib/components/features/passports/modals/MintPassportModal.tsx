'use client';
import { useState, useEffect } from 'react';
import { createPublicClient, decodeEventLog, formatUnits, http, type Address, type EIP1193Provider } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { Button, modal, ModalContent, toast } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { appKit, useAppKitProvider } from '$lib/utils/appkit';
import { approveERC20Spender, checkBalanceSufficient, createViemClients, getViemChainConfig, isNativeToken } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
import { CurrencyClient } from '$lib/services/currency';
import { SignTransactionModal } from '$lib/components/features/modals/SignTransaction';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { AbstractPassportABI } from '$lib/abis/AbstractPassport';

import { ContractAddressFieldMapping, PASSPORT_PROVIDER } from '../types';
import { usePassportChain } from '$lib/hooks/usePassportChain';

type MintData = {
  signature: string;
  price: string;
  metadata: string;
};

export function MintPassportModal({
  onComplete,
  mintData,
  provider,
  passportImage,
}: {
  onComplete: (txHash: string, tokenId: string) => void;
  mintData: MintData;
  provider: PASSPORT_PROVIDER;
  passportImage?: string;
}) {
  const { walletProvider } = useAppKitProvider<EIP1193Provider>('eip155');

  const chain = usePassportChain(provider);
  const [status, setStatus] = useState<'signing' | 'confirming' | 'success' | 'none'>('none');
  const [currency, setCurrency] = useState<string | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const [currencyDecimals, setCurrencyDecimals] = useState<number>(18);

  const contractAddress = chain?.[ContractAddressFieldMapping[provider] as keyof Chain] as string | undefined;

  useEffect(() => {
    if (!chain || !contractAddress) return;

    const loadCurrencyAndSymbol = async () => {
      const viemChain = getViemChainConfig(chain);
      const publicClient = createPublicClient({
        chain: viemChain,
        transport: http(chain.rpc_url),
      });
      const currencyAddress = await publicClient.readContract({
        abi: AbstractPassportABI,
        address: contractAddress as Address,
        functionName: 'currency',
      }) as Address;

      setCurrency(currencyAddress);

      const currencyClient = new CurrencyClient(chain, currencyAddress);
      const [symbol, decimals] = await Promise.all([
        currencyClient.getSymbol(),
        currencyClient.getDecimals(),
      ]);
      
      setCurrencySymbol(symbol);
      setCurrencyDecimals(decimals);
    };

    loadCurrencyAndSymbol();
  }, [chain, contractAddress]);

  const handleMint = async () => {
    try {
      if (!mintData) {
        throw new Error('Mint data not found');
      }

      if (!contractAddress || !chain?.chain_id ) {
        throw new Error('Passport contract address not configured');
      }

      if (currency === null || !walletProvider || !chain?.chain_id) {
        throw new Error('Currency not loaded');
      }

      setStatus('signing');

      const priceWei = BigInt(mintData.price || '0');
      const isNative = isNativeToken(currency, chain.chain_id);

      const { walletClient, publicClient, account } = await createViemClients(
        chain.chain_id,
        walletProvider
      );

      if (priceWei > 0n) {
        await checkBalanceSufficient({
          publicClient,
          tokenAddress: currency,
          chainId: chain.chain_id,
          amount: priceWei,
          account: account as Address,
        });
      }

      if (!isNative && priceWei > 0n) {
        await approveERC20Spender({
          walletClient,
          tokenAddress: currency as Address,
          spender: contractAddress as Address,
          amount: priceWei,
          account: account as Address,
        });
      }

      const hash = await walletClient.writeContract({
        abi: AbstractPassportABI,
        address: contractAddress as Address,
        functionName: 'mint',
        args: [mintData.metadata, priceWei, mintData.signature],
        account,
        value: isNative ? priceWei : 0n,
      });

      const txHash = hash;

      setStatus('confirming');

      let tokenId = '';
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: AbstractPassportABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === 'Transfer') {
            const id = decoded.args?.tokenId as bigint | undefined;
            if (id != null) {
              tokenId = id.toString();
              break;
            }
          }
        } catch {
        }
      }

      modal.close();
      onComplete(txHash, tokenId);
    } catch (error: unknown) {
      Sentry.captureException(error, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
          mintData,
        },
      });
      toast.error(formatError(error));
      setStatus('none');
    }
  };

  if (status === 'confirming') {
    return (
      <ConfirmTransaction
        title="Confirming Transaction"
        description="Please wait while your transaction is being confirmed on the blockchain."
      />
    );
  }

  if (status === 'signing') {
    return (
      <SignTransactionModal
        onClose={() => modal.close()}
        description="Please sign the transaction to pay gas fees & claim your Passport."
        onSign={handleMint}
        loading={true}
      />
    );
  }

  return (
    <ModalContent
      icon={
        <img
          src={passportImage || `${ASSET_PREFIX}/assets/images/passports/${provider}-passport-mini-new.png`}
          className="w-full object-cover aspect-[45/28]"
        />
      }
      className="**:data-icon:bg-transparent!"
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Claim Your Passport</p>
          <p className="text-sm">
            You're just one step away from owning your unique & personalized Passport. Mint & claim your on-chain
            identity.
          </p>
        </div>

        <Button variant="secondary" onClick={handleMint} disabled={!currency}>
          Mint {mintData?.price && +mintData.price > 0
            ? `‣ ${formatUnits(BigInt(mintData.price), currencyDecimals)} ${currencySymbol}`
            : '‣ Free'}
        </Button>
      </div>
    </ModalContent>
  );
}
