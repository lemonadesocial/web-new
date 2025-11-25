import { useEffect, useState } from 'react';
import { mainnet, sepolia } from 'viem/chains';
import { useAtomValue } from 'jotai';
import { BrowserProvider, type Eip1193Provider } from 'ethers';
import { formatEther, parseEther } from 'viem';

import { Button, Skeleton, modal, toast } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { ConnectWallet } from '../modals/ConnectWallet';
import { useTokenData } from './useCoin';
import { useAppKitProvider } from '$lib/utils/appkit';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { useBalance } from '$lib/hooks/useBalance';

const quickAmounts = ['0.01', '0.1', '0.5', '1'];

export function BuyCoin({ chain, address }: { chain: Chain; address: string }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const ethChainId = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? mainnet.id : sepolia.id;
  const ethChain = chainsMap[ethChainId];

  const [amount, setAmount] = useState('');
  const [isBuying, setIsBuying] = useState(false);
  const [tokenPrice, setTokenPrice] = useState<string | null>(null);
  const { walletProvider } = useAppKitProvider('eip155');

  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { formattedBalance } = useBalance();

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

  const executeBuy = async () => {
    if (!walletProvider) {
      toast.error('Connect your wallet to continue');
      return;
    }

    let buyAmount: bigint;

    try {
      buyAmount = parseEther(amount || '0');
    } catch {
      toast.error('Enter a valid ETH amount');
      return;
    }

    if (buyAmount <= BigInt(0)) {
      toast.error('Enter an amount greater than zero');
      return;
    }

    try {
      setIsBuying(true);
      const provider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await provider.getSigner();
      const flaunchClient = FlaunchClient.getInstance(chain, address, signer);
      const txHash = await flaunchClient.buyCoin({ buyAmount });
      console.log(txHash)
      toast.success(`Transaction submitted: ${txHash}`);
    } catch (error) {
      console.log(error)
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
      <div className="w-full max-w-[336px] rounded-md bg-card border border-card-border py-3 px-4">
        <Skeleton animate className="h-4 w-32 rounded-full" />
        <Skeleton animate className="h-24 w-full rounded-sm mt-4" />
        <Skeleton animate className="h-16 w-full rounded-sm mt-4" />
        <Skeleton animate className="h-10 w-full rounded-sm mt-4" />
      </div>
    );
  }

  if (!tokenData) return null;

  return (
    <div className="w-full max-w-[336px] rounded-md bg-card border border-card-border py-3 px-4">
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
            {
              ethChain.logo_url && <img src={ethChain.logo_url} alt={ethChain.name} className="size-4 rounded-full" />
            }
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
          {quickAmounts.map(value => (
            <Button
              key={value}
              size="xs"
              variant="tertiary"
              onClick={() => setAmount(value)}
            >
              {value} ETH
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-sm bg-primary/8">
        <div className="flex items-center justify-between py-2.5 px-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-tertiary">0 ETH</p>
            <i className="icon-arrow-foward-sharp text-tertiary size-4" />
            <p className="text-sm text-tertiary">0 {tokenData.symbol}</p>
          </div>
          <p className="text-sm text-tertiary">~$0</p>
        </div>
        <hr className="border-t border-t-divider" />
        <div className="flex items-center justify-between py-2.5 px-3">
          <p className="text-sm text-tertiary">Slippage</p>
          <p className="text-sm text-tertiary">5%</p>
        </div>
      </div>

      <Button variant="secondary" className="w-full mt-4" onClick={handleBuyCoin} loading={isBuying}>
        Buy {tokenData.symbol}
      </Button>
    </div>
  );
}

