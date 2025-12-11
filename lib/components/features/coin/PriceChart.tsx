'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import clsx from 'clsx';
import { format } from 'date-fns';
import { formatEther } from 'viem';

import { Card, Skeleton, Button } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { usePoolSwapPriceTimeSeries, useEthToUsdcRate } from '$lib/hooks/useCoin';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { formatNumber } from '$lib/utils/number';

interface PriceChartProps {
  chain: Chain;
  address: string;
}

type TimeRange = '1H' | '1D' | '1W' | '1M' | '1Y' | 'All';

export function PriceChart({ chain, address }: PriceChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1D');
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  const timeRange = useMemo(() => {
    const endTime = new Date();
    let startTime: Date | undefined;

    switch (selectedRange) {
      case '1H':
        startTime = new Date(endTime.getTime() - 60 * 60 * 1000);
        break;
      case '1D':
        startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '1W':
        startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        startTime = new Date(endTime.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'All':
        startTime = undefined;
        break;
    }

    return { startTime, endTime };
  }, [selectedRange]);

  const { data: priceData, isLoading } = usePoolSwapPriceTimeSeries(
    chain,
    address,
    timeRange.startTime ? timeRange : undefined,
  );

  const { rate: ethToUsdcRate } = useEthToUsdcRate(chain, address);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (!ethToUsdcRate) return;
      
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const ethAmount = await flaunchClient.getEthValueForAmount();
      const ethValue = Number(formatEther(ethAmount));
      const usdcValue = ethValue * ethToUsdcRate;
      setCurrentPrice(usdcValue.toString());
    };

    fetchCurrentPrice();
  }, [chain, address, ethToUsdcRate]);

  useEffect(() => {
    if (priceData.length < 2) {
      setPriceChange(null);
      return;
    }

    const latestPrice = priceData[priceData.length - 1]?.price || 0;
    const previousPrice = priceData[0]?.price || 0;

    if (previousPrice > 0) {
      const change = ((latestPrice - previousPrice) / previousPrice) * 100;
      setPriceChange(change);
    } else {
      setPriceChange(null);
    }
  }, [priceData]);

  const formattedPrice = currentPrice ? `$${formatNumber(Number(currentPrice), true)}` : null;
  const formattedChange = priceChange !== null
    ? `${priceChange >= 0 ? '+' : '-'}${priceChange.toFixed(2)}%`
    : null;

  const timeRanges: TimeRange[] = ['1H', '1D', '1W', '1M', '1Y', 'All'];

  const chartData = priceData.map((item) => ({
    time: item.timestamp,
    price: item.price,
  }));

  return (
    <Card.Root>
      <Card.Content className="p-0 relative">
        <div className="absolute top-4 left-0 px-4">
          <p className="text-tertiary text-sm">Price</p>
          <h4 className="text-2xl font-semibold">{formattedPrice}</h4>
          {formattedChange && (
            <p className={clsx('text-sm', priceChange && priceChange >= 0 ? 'text-success-500' : 'text-error')}>
              {formattedChange} ({selectedRange})
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4 px-4">

          <div className="flex gap-0.5">
            {timeRanges.map((range) => (
              <Button
                key={range}
                size="sm"
                variant={selectedRange === range ? 'tertiary' : 'flat'}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>


        <div className="h-[300px] w-full relative">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-tertiary">Loading...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-tertiary">
              <p>No price data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(253, 224, 71, 0.08)" />
                    <stop offset="100%" stopColor="rgba(253, 224, 71, 0)" />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={true}
                  horizontal={false}
                  stroke="rgba(255, 255, 255, 0.1)"
                />
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
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="rgba(253, 224, 71, 1)"
                  fill="url(#priceGradient)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: 'rgba(253, 224, 71, 1)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card.Content>
    </Card.Root>
  );
}

