import { useEffect, useState } from 'react';
import { BrowserProvider, type Eip1193Provider } from 'ethers';
import { formatEther, parseUnits } from 'viem';
import * as Sentry from '@sentry/nextjs';
import { Provider } from '@reown/appkit/react';
import { useSendCalls } from 'wagmi';
import { waitForCallsStatus } from '@wagmi/core';

import { Button, Skeleton, modal, toast } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useTokenData } from '$lib/hooks/useCoin';
import { useAppKitProvider, useAppKitAccount } from '$lib/utils/appkit';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { useTokenBalance } from '$lib/hooks/useBalance';
import { formatNumber } from '$lib/utils/number';
import { formatError, getTransactionUrl } from '$lib/utils/crypto';
import { config } from '$lib/utils/wagmi';

import { ConnectWallet } from '../modals/ConnectWallet';
import { TxnConfirmedModal } from '../create-coin/TxnConfirmedModal';

const quickAmounts = [10, 20, 50, 100];

export function SellCoin({ chain, address }: { chain: Chain; address: string }) {
  const [amount, setAmount] = useState('');
  const [isSelling, setIsSelling] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<string | null>(null);
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { address: userAddress } = useAppKitAccount();

  const { sendCalls, error, data, reset } = useSendCalls();
  const [resolver, setResolver] = useState<(id?: string, err?: any) => void>();

  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { formattedBalance, balance } = useTokenBalance(chain, address);

  const send7702Calls = async (calls: any[]) => {
    const promise = new Promise<string>((resolve, reject) => {
      setResolver(() => (id?: string, err?: any) => {
        if (err) {
          reject(err);
        } else if (id) {
          waitForCallsStatus(config, { id })
            .then((status) => {
              const txHash = status.receipts?.[0]?.transactionHash;
              if (status.status === 'success' && txHash) {
                resolve(txHash);
              } else {
                reject(status);
              }
            })
            .finally(() => {
              reset();
            });
        }
      });

      sendCalls({ calls, chainId: Number(chain.chain_id) });
    });

    return promise;
  };

  useEffect(() => {
    if (resolver && (data?.id || error)) {
      resolver(data?.id, error);
    }
  }, [resolver, data, error]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const flaunchClient = FlaunchClient.getInstance(chain, address);
        const ethAmount = await flaunchClient.getEthValueForAmount();
        setTokenPrice(formatEther(ethAmount));
      } catch (error) {
        console.error('Failed to fetch price', error);
        setTokenPrice(null);
      }
    };

    fetchPrice();
  }, [chain, address]);

  const executeSell = async () => {
    if (!walletProvider) {
      toast.error('Connect your wallet to continue');
      return;
    }

    if (!tokenData) {
      toast.error('Token data not available');
      return;
    }

    try {
      const sellAmount = parseUnits(amount || '0', tokenData.decimals);

      if (sellAmount > balance) {
        toast.error('Insufficient balance');
        return;
      }

      if (!userAddress) {
        toast.error('Wallet address not available');
        return;
      }
      setIsSelling(true);
      const provider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await provider.getSigner();
      const flaunchClient = FlaunchClient.getInstance(chain, address, signer);

      const txHash = await flaunchClient.sellCoinWith7702((userOps) => send7702Calls(userOps), {
        sellAmount,
        recipient: userAddress,
      });

      modal.open(TxnConfirmedModal, {
        props: {
          title: 'Coin Sold',
          description: `You have successfully sold ${amount} ${tokenData.symbol}.`,
          txUrl: getTransactionUrl(chain, txHash),
        },
      });
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
      toast.error(formatError(error));
    } finally {
      setIsSelling(false);
    }
  };

  const handleSellCoin = () => {
    modal.open(ConnectWallet, {
      props: {
        chain,
        onConnect: () => {
          executeSell();
        },
      },
    });
  };

  const handlePercentageClick = (value: number) => {
    if (value === 100) {
      setAmount(formattedBalance);
      return;
    }

    const balanceNum = Number(formattedBalance);
    const calculatedAmount = (balanceNum * value) / 100;
    const fixedStr = calculatedAmount.toFixed(3);

    if (fixedStr.includes('e')) {
      const coefficient = parseFloat(fixedStr.split('e')[0]);
      setAmount(coefficient.toFixed(3));
      return;
    }

    setAmount(fixedStr);
  };

  if (isLoadingTokenData) {
    return (
      <div className="w-full py-3 px-4">
        <Skeleton animate className="h-4 w-32 rounded-full" />
        <Skeleton animate className="h-24 w-full rounded-sm mt-4" />
        <Skeleton animate className="h-16 w-full rounded-sm mt-4" />
        <Skeleton animate className="h-10 w-full rounded-sm mt-4" />
      </div>
    );
  }

  if (!tokenData) return null;

  return (
    <div className="w-full py-3 px-4">
      {tokenPrice && (
        <p className="text-tertiary">
          1 ETH = {1 / Number(tokenPrice)} {tokenData.symbol}
        </p>
      )}

      <div className="mt-3 py-2 px-3 rounded-sm bg-primary/8 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center py-1.5 px-2.5 justify-center rounded-full bg-primary/8 gap-1.5">
            {/* {ethChain.logo_url && <img src={ethChain.logo_url} alt={ethChain.name} className="size-4 rounded-full" />} */}
            <p className="text-secondary font-medium text-sm">{tokenData.symbol}</p>
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl bg-transparent border-none outline-none text-right w-full"
          />
        </div>
        <p className="text-sm text-tertiary">
          Balance:{' '}
          <span className="text-primary">
            {formatNumber(Number(formattedBalance))} {tokenData.symbol}
          </span>
        </p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((value) => (
            <Button key={value} size="xs" variant="tertiary" onClick={() => handlePercentageClick(value)}>
              {value}%
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-sm bg-primary/8">
        <div className="flex items-center justify-between py-2.5 px-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-tertiary">
              {formatNumber(Number(amount))} {tokenData.symbol}
            </p>
            <i className="icon-arrow-foward-sharp text-tertiary size-4" />
            <p className="text-sm text-tertiary">{formatNumber(Number(amount) * Number(tokenPrice))} ETH</p>
          </div>
          {/* <p className="text-sm text-tertiary">~$0</p> */}
        </div>
        <hr className="border-t border-t-divider" />
        <div className="flex items-center justify-between py-2.5 px-3">
          <p className="text-sm text-tertiary">Slippage</p>
          <p className="text-sm text-tertiary">5%</p>
        </div>
      </div>

      <Button
        variant="secondary"
        className="w-full mt-4"
        onClick={handleSellCoin}
        loading={isSelling}
        disabled={!amount || Number(amount) <= 0}
      >
        Sell {tokenData.symbol}
      </Button>
    </div>
  );
}
