import { useEffect, useState } from 'react';
import { mainnet, sepolia } from 'viem/chains';
import { useAtomValue } from 'jotai';
import { decodeEventLog, formatEther, parseEther, formatUnits, type EIP1193Provider } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { Button, Skeleton, modal, toast } from '$lib/components/core';
import { chainsMapAtom } from '$lib/jotai';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useTokenData } from '$lib/hooks/useCoin';
import { useAppKitAccount, appKit } from '$lib/utils/appkit';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { ConnectWallet } from '../modals/ConnectWallet';
import { useBalance } from '$lib/hooks/useBalance';
import { formatNumber } from '$lib/utils/number';
import { createViemClients, getTransactionUrl } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
import { TxnConfirmedModal } from '../create-coin/TxnConfirmedModal';
import { ERC20 } from '$lib/abis/ERC20';
import { SlippageSelect } from './SlippageSelect';

const quickAmounts = ['0.01', '0.1', '0.5', '1'];

export function BuyCoin({ chain, address }: { chain: Chain; address: string }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const ethChainId = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? mainnet.id : sepolia.id;
  const ethChain = chainsMap[ethChainId];

  const [amount, setAmount] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(5);

  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { formattedBalance } = useBalance();

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const flaunchClient = FlaunchClient.getInstance(chain, address);
        const ethAmount = await flaunchClient.getEthValueForAmount();
        setTokenPrice(formatEther(ethAmount));
      } catch (error) {
        Sentry.captureException(error);
        setTokenPrice(null);
      }
    };

    fetchPrice();
  }, [chain, address]);

  const executeBuy = async () => {
    const walletProvider = appKit.getProvider('eip155');
    const userAddress = appKit.getAddress();

    if (!walletProvider || !userAddress) {
      toast.error('Wallet isn’t fully connected yet. Please try again in a moment.');
      return;
    }

    try {
      const buyAmount = parseEther(amount || '0');

      setIsBuying(true);
      const { walletClient, publicClient } = await createViemClients(chain.chain_id, walletProvider as EIP1193Provider);
      const flaunchClient = FlaunchClient.getInstance(chain, address, walletClient);

      const txHash = await flaunchClient.buyCoin({
        buyAmount,
        slippageTolerance: slippage * 100,
        recipient: userAddress,
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });

      let tokenAmount: string | null = null;

      if (receipt && tokenData && userAddress) {
        const memecoinAddressLower = address.toLowerCase();
        const userAddressLower = userAddress.toLowerCase();

        for (const log of receipt.logs) {
          if (log.address?.toLowerCase() !== memecoinAddressLower) continue;

          try {
            const decoded = decodeEventLog({
              abi: ERC20,
              data: log.data,
              topics: log.topics,
            });
            if (decoded.eventName === 'Transfer' && (decoded.args as { to?: string }).to?.toLowerCase() === userAddressLower) {
              const value = (decoded.args as { value: bigint }).value;
              tokenAmount = formatNumber(Number(formatUnits(value, tokenData.decimals)));
              break;
            }
          } catch {
            continue;
          }
        }
      }
      
      const description = tokenAmount && tokenData
        ? `${tokenAmount} ${tokenData.symbol} has been added to your wallet.`
        : `You have successfully purchased ${formatNumber(Number(amount))} ETH worth of ${tokenData?.symbol || 'tokens'}.`;
      
      modal.open(TxnConfirmedModal, {
        props: {
          title: 'Purchase Complete',
          description,
          txUrl: getTransactionUrl(chain, txHash)
        }
      });
    } catch (error) {
      Sentry.captureException(error);
      toast.error(formatError(error));
    } finally {
      setIsBuying(false);
    }
  };

  const handleBuyCoin = () => {
    modal.open(ConnectWallet, {
      props: {
        chain,
        onConnect: () => {
          executeBuy();
        },
      },
    });
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
      {
        tokenPrice && (
          <p className="text-tertiary">
            1 {tokenData.symbol} = {tokenPrice} ETH
          </p>
        )
      }

      <div className="mt-3 py-2 px-3 rounded-sm bg-primary/8 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center py-1.5 px-4.5 justify-center rounded-full bg-primary/8 gap-1.5">
            {ethChain.logo_url && <img src={ethChain.logo_url} alt={ethChain.name} className="size-4 rounded-full" />}
            <p className="text-secondary font-medium text-sm">ETH</p>
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl bg-transparent border-none outline-none text-right w-full"
          />
        </div>
        <p className="text-sm text-tertiary">Balance: <span className="text-primary">{formattedBalance} ETH</span></p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map((value) => (
            <Button key={value} size="xs" variant="tertiary" onClick={() => setAmount(value)}>
              {value} ETH
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-sm bg-primary/8">
        <div className="flex items-center justify-between py-2.5 px-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-tertiary">{formatNumber(Number(amount))} ETH</p>
            <i aria-hidden="true" className="icon-arrow-foward-sharp text-tertiary size-4" />
            <p className="text-sm text-tertiary">{formatNumber(Number(amount) / Number(tokenPrice))} {tokenData.symbol}</p>
          </div>
          {/* <p className="text-sm text-tertiary">~$0</p> */}
        </div>
        <hr className="border-t border-t-divider" />
        <SlippageSelect value={slippage} onChange={setSlippage} />
      </div>

      <Button
        variant="secondary"
        className="w-full mt-4"
        onClick={handleBuyCoin}
        loading={isBuying}
        disabled={!amount || Number(amount) <= 0}
      >
        Buy {tokenData.symbol}
      </Button>
    </div>
  );
}
