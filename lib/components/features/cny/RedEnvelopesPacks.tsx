'use client';

import React, { useEffect, useState } from 'react';
import { RedEnvelopeClient, type Pricing } from '$lib/services/red-envelope';
import { modal } from '$lib/components/core';
import { BuyRedEnvelopesModal } from './modals/BuyRedEnvelopesModal';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { getListChains } from '$lib/utils/crypto';
import { ASSET_PREFIX, MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { formatPriceLabel, getAsset } from './utils';

type Pack = {
  quantity: number;
  asset: string;
  discountLabel?: string;
  priceLabel: string;
  price: bigint;
  decimals: number;
};

const getQuantityLabel = (quantity: number) => {
  if (quantity === 1) return '1 Envelope';
  return `${quantity} Envelopes`;
};

const getDiscountLabel = (preDiscountPrice: bigint, price: bigint): string | undefined => {
  if (preDiscountPrice === 0n) return undefined;
  const p = Number(price);
  const pre = Number(preDiscountPrice);
  if (p >= pre) return undefined;
  const discount = Math.round((1 - p / pre) * 100);
  return discount > 0 ? `${discount}%` : undefined;
};

const pricingToPacks = (pricing: readonly Pricing[], decimals: number): Pack[] =>
  [...pricing]
    .sort((a, b) => Number(a.count - b.count))
    .map(({ count, price, preDiscountPrice }) => {
      const quantity = Number(count);
      return {
        quantity,
        asset: getAsset(quantity),
        discountLabel: getDiscountLabel(preDiscountPrice, price),
        priceLabel: formatPriceLabel(price, decimals),
        price,
        decimals,
      };
    });
    
const PackCard = ({ pack }: { pack: Pack }) => {
  const quantityLabel = getQuantityLabel(pack.quantity);

  const handleClick = () => {
    const chains = getListChains();
    const megaEthChain = chains.find(chain => chain.chain_id === MEGAETH_CHAIN_ID.toString());

    modal.open(ConnectWallet, {
      props: {
        chain: megaEthChain,
        onConnect: () => {
          modal.open(BuyRedEnvelopesModal, {
            props: {
              pack: {
                quantity: pack.quantity,
                price: pack.price,
                decimals: pack.decimals,
              },
            },
          });
        },
      },
    });
  };

  return (
    <div
      className="relative flex flex-col items-center gap-2 px-4 pt-4 pb-3 aspect-square rounded-md bg-primary/8 cursor-pointer hover:bg-primary/12 transition-colors"
      onClick={handleClick}
    >
      {pack.discountLabel && (
        <div className="absolute top-[-4px] right-2.5 w-[64px] h-[64px]">
          <img src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/discount-tag.png`} alt="" className="w-full h-full object-contain" />
          <p className="absolute inset-0 flex items-center justify-center text-warning-400 text-sm">
            {pack.discountLabel}
          </p>
        </div>
      )}
      <div className="px-[38px] py-6 flex-1 flex items-center justify-center">
        <img
          src={pack.asset}
          alt={quantityLabel}
          width={160}
          height={160}
        />
      </div>

      <div className="flex items-end justify-between gap-4 w-full">
        <p className="text-secondary">{quantityLabel}</p>
        <p className="text-success-500">{pack.priceLabel}</p>
      </div>
    </div>
  );
};

export const RedEnvelopesPacks = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        const client = RedEnvelopeClient.getInstance();
        const [pricing, decimals] = await Promise.all([
          client.getAllPricing(),
          client.getCurrencyDecimals(),
        ]);
        
        if (cancelled) return;
        setPacks(pricingToPacks(pricing, decimals));
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load pricing');
        setPacks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-5">
      <div className="space-y-0.5">
        <p className="text-xl">Get Red Envelopes</p>
        <p className="text-tertiary">
          Assign each envelope to a wallet, add a message, and send your wishes.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-md bg-primary/8 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {packs.map((pack) => (
            <div key={pack.quantity}>
              <PackCard pack={pack} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

