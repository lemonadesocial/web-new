'use client';

import { useEffect, useState } from 'react';

import { ModalContent, Spacer, modal } from '$lib/components/core';
import { RedEnvelopeClient, type Pricing } from '$lib/services/red-envelope';
import { getListChains } from '$lib/utils/crypto';
import { MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { formatPriceLabel, getAsset } from '../utils';
import { BuyRedEnvelopesModal } from './BuyRedEnvelopesModal';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';

type Pack = {
  quantity: number;
  asset: string;
  priceLabel: string;
  price: bigint;
  decimals: number;
};

const getQuantityLabel = (quantity: number) => {
  if (quantity === 1) return '1 Envelope';
  return `${quantity} Envelopes`;
};

const pricingToPacks = (pricing: readonly Pricing[], decimals: number): Pack[] =>
  [...pricing]
    .sort((a, b) => Number(a.count - b.count))
    .map(({ count, price }) => {
      const quantity = Number(count);
      return {
        quantity,
        asset: getAsset(quantity),
        priceLabel: formatPriceLabel(price, decimals),
        price,
        decimals,
      };
    });

export function BuyRedEnvelopesListModal() {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const run = async () => {
      try {
        const client = RedEnvelopeClient.getInstance();
        const [pricing, decimals] = await Promise.all([
          client.getAllPricing(),
          client.getCurrencyDecimals(),
        ]);

        if (cancelled) return;
        setPacks(pricingToPacks(pricing, decimals));
      } catch {
        if (!cancelled) setPacks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePackClick = (pack: Pack) => {
    const chains = getListChains();
    const megaEthChain = chains.find((chain) => chain.chain_id === MEGAETH_CHAIN_ID.toString());

    modal.close();

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
    <ModalContent
      onClose={() => modal.close()}
      icon="icon-plus"
      className="w-[340px] max-w-full flex flex-col"
    >
      <div className="space-y-1.5">
        <p className="text-lg">Buy Red Envelopes</p>
        <p className="text-sm text-tertiary">
          Choose a bundle of red envelopes to get started. You can fill and send them anytime.
        </p>
      </div>

      <Spacer />

      <div className="space-y-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-primary/8 animate-pulse" />
            ))}
          </div>
        ) : (
          packs.map((pack) => (
            <div
              key={pack.quantity}
              role="button"
              tabIndex={0}
              onClick={() => handlePackClick(pack)}
              onKeyDown={(e) => e.key === 'Enter' && handlePackClick(pack)}
              className="flex items-center gap-3 py-1.5 px-3 rounded-sm bg-primary/8 hover:bg-primary/12 cursor-pointer transition-colors"
            >
              <img
                src={pack.asset}
                alt={getQuantityLabel(pack.quantity)}
                className="size-12 object-contain shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p>{getQuantityLabel(pack.quantity)}</p>
                <p className="text-sm text-success-500">{pack.priceLabel}</p>
              </div>
              <i className="icon-chevron-right size-5 text-tertiary shrink-0" />
            </div>
          ))
        )}
      </div>
    </ModalContent>
  );
}
