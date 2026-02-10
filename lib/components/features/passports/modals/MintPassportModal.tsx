'use client';
import React, { useState, useEffect } from 'react';
import { Eip1193Provider, ethers } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { Button, modal, ModalContent, toast } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { appKit, useAppKitProvider } from '$lib/utils/appkit';
import { approveERC20Spender, AbstractPassportContract, ERC20Contract, formatError, isNativeToken, writeContract } from '$lib/utils/crypto';
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
  const { walletProvider } = useAppKitProvider('eip155');

  const chain = usePassportChain(provider);
  const [status, setStatus] = useState<'signing' | 'confirming' | 'success' | 'none'>('none');
  const [currency, setCurrency] = useState<string | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string>('');
  const [currencyDecimals, setCurrencyDecimals] = useState<number>(18);

  const contractAddress = chain?.[ContractAddressFieldMapping[provider] as keyof Chain] as string | undefined;

  useEffect(() => {
    if (!chain?.rpc_url || !contractAddress) return;

    const loadCurrencyAndSymbol = async () => {
      const rpcProvider = new ethers.JsonRpcProvider(chain.rpc_url);
      const contract = AbstractPassportContract.attach(contractAddress).connect(rpcProvider) as ethers.Contract;
      const value = await contract.getFunction('currency')();
      setCurrency(value);

      const fromChainToken = chain.tokens?.find((t) => t.contract?.toLowerCase() === value?.toLowerCase());
      if (fromChainToken) {
        setCurrencySymbol(fromChainToken.symbol);
        setCurrencyDecimals(fromChainToken.decimals);
        return;
      }

      const erc20 = ERC20Contract.attach(value).connect(rpcProvider) as ethers.Contract;
      const [sym, decimals] = await Promise.all([
        erc20.getFunction('symbol')(),
        erc20.getFunction('decimals')(),
      ]);
      
      setCurrencySymbol(sym);
      setCurrencyDecimals(Number(decimals));
    };

    loadCurrencyAndSymbol();
  }, [chain?.rpc_url, chain?.tokens, contractAddress]);

  const handleMint = async () => {
    try {
      if (!mintData) {
        throw new Error('Mint data not found');
      }

      if (!contractAddress) {
        throw new Error('Passport contract address not configured');
      }

      if (currency === null) {
        throw new Error('Currency not loaded');
      }

      setStatus('signing');

      const priceWei = BigInt(mintData.price);
      const isNative = isNativeToken(currency, chain?.chain_id || '');

      if (!isNative && priceWei > 0n) {
        await approveERC20Spender(
          currency,
          contractAddress as string,
          priceWei,
          walletProvider as Eip1193Provider,
        );
      }

      const transaction = await writeContract(
        AbstractPassportContract,
        contractAddress as string,
        walletProvider as Eip1193Provider,
        'mint',
        [mintData.metadata, mintData.price, mintData.signature],
        { value: isNative ? mintData.price : 0 },
      );

      const txHash = transaction.hash;

      setStatus('confirming');

      const receipt = await transaction.wait();
      const iface = new ethers.Interface(AbstractPassportABI);

      let parsedTransferLog: any = null;

      receipt.logs.some((log: any) => {
        try {
          const parsedLog = iface.parseLog(log);
          if (parsedLog?.name === 'Transfer') {
            parsedTransferLog = parsedLog;
            return true;
          }

          return false;
        } catch (error) {
          return false;
        }
      });

      let tokenId = '';

      if (parsedTransferLog) {
        tokenId = parsedTransferLog.args?.tokenId?.toString();
      }

      modal.close();
      onComplete(txHash, tokenId);
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
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
          Mint {mintData?.price && +mintData.price > 0 ? `‣ ${ethers.formatUnits(mintData.price, currencyDecimals)} ${currencySymbol}` : '‣ Free'}
        </Button>
      </div>
    </ModalContent>
  );
}
