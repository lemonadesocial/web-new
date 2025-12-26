'use client';
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis } from 'recharts';
import { format } from 'date-fns';
import { match, P } from 'ts-pattern';

import { Spacer } from '$lib/components/core';
import { Chain, Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import {
  useMarketCap,
  useMarketCapChange,
  usePoolSwapPriceTimeSeries,
  useStakingCoin,
  useTokenData,
} from '$lib/hooks/useCoin';
import { formatNumber } from '$lib/utils/number';
import { WidgetContent } from './WidgetContent';
import clsx from 'clsx';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetCommunityCoin({ space, title, subtitle }: Props) {
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];
  const { stakingToken, chain } = useStakingCoin(space._id);

  return (
    <WidgetContent space={space} canSubscribe={!stakingToken && !chain} title="Community Coin" className="col-span-2">
      {match([chain, stakingToken])
        .with([P.not(P.nullish), P.not(P.nullish)], ([chain, address]) => (
          <CommunityCoin chain={chain} address={address} />
        ))
        .otherwise(() => (
          <div className="p-6 flex flex-col gap-5">
            <div className="absolute top-0 left-0 right-0">
              <img
                src={`${ASSET_PREFIX}/assets/images/passports/templates/${state.template.provider}-community-coin.png`}
                className="w-full h-full"
              />
            </div>

            <Spacer className="h-[148px]" />

            <div className="text-center">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-tertiary">{subtitle}</p>
            </div>
          </div>
        ))}
    </WidgetContent>
  );
}

function CommunityCoin({ chain, address }: { chain: Chain; address: string }) {
  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { formattedMarketCap, isLoadingMarketCap } = useMarketCap(chain, address);
  const { percentageChange, isLoadingMarketCapChange } = useMarketCapChange(chain.chain_id, address);

  const { data: priceData, isLoading } = usePoolSwapPriceTimeSeries(chain, address);

  if (isLoadingTokenData || isLoadingMarketCap || isLoading || isLoadingMarketCapChange) {
    return (
      <div className="flex justify-center items-center">
        <p>loading... </p>
      </div>
    );
  }

  const chartData = priceData.map((item) => ({
    time: item.timestamp,
    price: item.price,
  }));

  return (
    <>
      <div className="py-5 px-6 flex justify-between items-center">
        <div className="flex items-center flex-1 gap-4">
          {tokenData?.metadata?.imageUrl ? (
            <img
              src={tokenData?.metadata.imageUrl}
              alt={tokenData?.name}
              className="size-[48px] aspect-square rounded-sm object-cover"
            />
          ) : (
            <div className="size-[48px] aspect-square rounded-sm bg-gray-500" />
          )}
          <div>
            <h3 className="text-xl font-semibold">${tokenData?.symbol}</h3>
            <p className="text-tertiary">{tokenData?.name} Coin</p>
          </div>
        </div>
        <div>
          {formattedMarketCap && <h3 className="text-xl font-semibold">{formattedMarketCap}</h3>}
          <p className="text-tertiary">Market cap</p>
        </div>
      </div>

      <div className="px-4">
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={chartData}>
            {/* <defs> */}
            {/*   <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1"> */}
            {/*     <stop offset="0%" stopColor="rgb(from var(--color-accent-500) r g b / 0.3)" /> */}
            {/*     <stop offset="100%" stopColor="rgb(from var(--color-accent-500) r g b / 0)" /> */}
            {/*   </linearGradient> */}
            {/* </defs> */}
            {/* <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="rgba(255, 255, 255, 0.1)" /> */}
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '0.375rem',
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  const timeValue = payload[0].payload.time;
                  return format(new Date(timeValue), 'MMM d, yyyy HH:mm');
                }
                return '';
              }}
              formatter={(value: number) => [`$${formatNumber(value, true)}`, 'Price']}
            />
            <XAxis dataKey="price" padding={{ left: 4, right: 4 }} height={0} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-accent-500)"
              fill="url(#priceGradient)"
              strokeWidth={2}
              dot={<RenderLastDot data={chartData} />}
              activeDot={<CustomActiveDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex p-6 pb-5">
        <div className="flex flex-1 gap-8">
          <div>
            <p className="text-tertiary text-sm">Price</p>
            <p>${formatNumber(chartData[chartData.length - 1]?.price, true)}</p>
          </div>
          <div>
            <p className="text-tertiary text-sm">Profit & Loss</p>
            <p className={clsx(!!percentageChange && percentageChange > 0 ? 'text-success-500' : 'text-danger-500')}>
              {percentageChange?.toFixed(2)}% <span className="text-primary">(1D)</span>
            </p>
          </div>
        </div>
        <div>
          <p className="text-tertiary text-sm">Holders</p>
          <p>$0.0097</p>
        </div>
      </div>
    </>
  );
}

const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={6} fill="var(--color-accent-500)" stroke="var(--color-accent-500)" strokeWidth={2} />
  );
};

const RenderLastDot = (props: any) => {
  const { cx, cy, index, data } = props;

  // Only render if it's the last index in the data array
  if (index === data.length - 1) {
    return (
      <circle cx={cx} cy={cy} r={6} fill="var(--color-accent-500)" stroke="var(--color-accent-500)" strokeWidth={2} />
    );
  }

  return null;
};
