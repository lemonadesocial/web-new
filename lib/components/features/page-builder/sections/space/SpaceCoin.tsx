'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHref, sanitizeMediaSrc } from '../../utils/sanitize-html';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface SpaceCoinProps {
  // Layout props
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  // Content props
  heading?: string;
  coin_name?: string;
  coin_symbol?: string;
  coin_image_url?: string;
  description?: string;
  price?: string;
  price_change_24h?: number;
  market_cap?: string;
  holders?: number;
  cta_text?: string;
  cta_url?: string;
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-card-border bg-primary/4 px-4 py-3">
      <span className="text-lg font-bold text-primary">{value}</span>
      <span className="text-xs font-medium text-secondary">{label}</span>
    </div>
  );
}

function _SpaceCoin({
  width = 'contained',
  padding = 'lg',
  alignment = 'center',
  min_height,
  background,
  heading = 'Community Token',
  coin_name = '',
  coin_symbol = '',
  coin_image_url = '',
  description = '',
  price = '',
  price_change_24h = 0,
  market_cap = '',
  holders = 0,
  cta_text = 'Buy Token',
  cta_url = '',
}: SpaceCoinProps) {
  const hasCoinImage = coin_image_url && coin_image_url.trim().length > 0;
  const hasCoinName = coin_name && coin_name.trim().length > 0;
  const hasCoinSymbol = coin_symbol && coin_symbol.trim().length > 0;
  const hasDescription = description && description.trim().length > 0;
  const hasPrice = price && price.trim().length > 0;
  const hasMarketCap = market_cap && market_cap.trim().length > 0;
  const _hasAnyContent = hasCoinName || hasCoinSymbol || hasPrice;

  const isPositiveChange = price_change_24h > 0;
  const isNegativeChange = price_change_24h < 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {/* Heading */}
      <h2 className="mb-6 text-2xl font-bold text-primary">
        {heading || 'Community Token'}
      </h2>

      {/* Coin card */}
      <div className="mx-auto max-w-lg rounded-lg border border-card-border bg-primary/4 p-6">
        {/* Coin identity */}
        <div className="flex flex-col items-center gap-4">
          {/* Coin image */}
          {hasCoinImage ? (
            <img
              src={sanitizeMediaSrc(coin_image_url)}
              alt={hasCoinName ? coin_name : 'Token'}
              className="size-20 rounded-full border-2 border-card-border object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-card-border bg-primary/4">
              <i className="icon-coin size-8 text-tertiary" />
            </div>
          )}

          {/* Name and symbol */}
          {hasCoinName || hasCoinSymbol ? (
            <div className="flex flex-col items-center gap-1">
              {hasCoinName && (
                <h3 className="text-lg font-bold text-primary">{coin_name}</h3>
              )}
              {hasCoinSymbol && (
                <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-secondary uppercase">
                  {coin_symbol}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-tertiary">Set up your community token</p>
          )}

          {/* Price and 24h change */}
          {hasPrice && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{price}</span>
              {price_change_24h !== 0 && (
                <span
                  className={clsx(
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    isPositiveChange && 'bg-green-500/20 text-green-400',
                    isNegativeChange && 'bg-red-500/20 text-red-400',
                  )}
                >
                  {isPositiveChange ? '+' : ''}
                  {price_change_24h.toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {hasDescription && (
          <p className="mt-4 text-center text-sm leading-relaxed text-secondary">
            {description}
          </p>
        )}

        {/* Stats row */}
        {(hasMarketCap || holders > 0) && (
          <div className="mt-5 grid grid-cols-2 gap-3">
            {hasMarketCap && (
              <StatCell label="Market Cap" value={market_cap} />
            )}
            {holders > 0 && (
              <StatCell
                label="Holders"
                value={holders.toLocaleString()}
              />
            )}
          </div>
        )}

        {/* CTA button */}
        <div className="mt-5 flex justify-center">
          <a
            href={sanitizeHref(cta_url)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            {cta_text || 'Buy Token'}
          </a>
        </div>
      </div>
    </SectionWrapper>
  );
}

export const SpaceCoin = React.memo(_SpaceCoin);
SpaceCoin.craft = {
  displayName: 'SpaceCoin',
  props: {
    width: 'contained',
    padding: 'lg',
    alignment: 'center',
    heading: 'Community Token',
    coin_name: '',
    coin_symbol: '',
    coin_image_url: '',
    description: '',
    price: '',
    price_change_24h: 0,
    market_cap: '',
    holders: 0,
    cta_text: 'Buy Token',
    cta_url: '',
  },
};
