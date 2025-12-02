'use client';
import React from 'react';
import { formatEther } from 'viem';

import { useQuery } from '$lib/graphql/request/hooks';
import { coinClient } from '$lib/graphql/request/instances';
import { MemecoinHolderDocument, Order_By } from '$lib/graphql/generated/coin/graphql';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { CardTable } from '$lib/components/core/table';
import { Skeleton } from '$lib/components/core';
import { formatWallet, getAddressUrl } from '$lib/utils/crypto';
import { formatNumber } from '$lib/utils/number';
import { TOTAL_SUPPLY } from '$lib/services/token-launch-pad';

interface CoinHoldersProps {
  chain: Chain;
  address: string;
}

export function CoinHolders({ chain, address }: CoinHoldersProps) {
  const [pagination, setPagination] = React.useState<{ limit: number; offset: number }>({
    limit: 20,
    offset: 0,
  });

  const { data, loading } = useQuery(
    MemecoinHolderDocument,
    {
      variables: {
        where: {
          memecoin: {
            _eq: address.toLowerCase(),
          },
          chainId: {
            _eq: Number(chain.chain_id),
          },
        },
        orderBy: {
          balance: Order_By.Desc,
        },
        limit: pagination.limit,
        offset: pagination.offset,
      },
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const holders = data?.MemecoinHolder || [];
  const isLoading = loading;
  const hasNextPage = holders.length === pagination.limit;
  const totalForPagination = hasNextPage
    ? pagination.offset + pagination.limit + 1
    : pagination.offset + holders.length;

  return (
    <CardTable.Root loading={isLoading} data={holders}>
      <CardTable.Header>
        <div className="flex gap-4 px-4 py-3 w-full">
          <p className="w-[50px]">Rank</p>
          <p className="w-[100px]">Wallet ID</p>
          <p className="w-[100px]">%</p>
          <p className="flex-1">Amount</p>
          {/* <p className="w-[96px] text-right">Value</p> */}
          <p className="w-[16px]"></p>
        </div>
      </CardTable.Header>

      <CardTable.Loading rows={10}>
        <Skeleton className="h-5 w-[40px]" animate />
        <Skeleton className="h-5 w-[100px]" animate />
        <Skeleton className="h-5 w-[50px]" animate />
        <Skeleton className="h-5 flex-1" animate />
        <Skeleton className="h-5 w-[96px]" animate />
        <Skeleton className="h-5 w-[16px]" animate />
      </CardTable.Loading>

      <CardTable.EmptyState
        icon="icon-user-group-rounded"
        title="No Holders"
        subtile="Once people start buying or receiving this coin, you'll see the holder list here."
      />

      {holders.map((holder, index) => {
        const balance = BigInt(holder.balance || '0');
        
        const balanceFormatted = formatEther(balance);
        const balanceNumber = Number(balanceFormatted);
        const percentage = Number(balance) / Number(TOTAL_SUPPLY) * 100;

        const rank = pagination.offset + index + 1;
        const addressUrl = getAddressUrl(chain, holder.holder);

        return (
          <CardTable.Row key={holder.id}>
            <div className="flex gap-4 px-4 py-3 items-center justify-between text-tertiary">
              <div className="w-[50px]">
                <p>{rank}</p>
              </div>
              <div className="w-[100px]">
                <p className="text-primary">{formatWallet(holder.holder, 4)}</p>
              </div>
              <div className="w-[100px]">
                <p>{formatNumber(percentage)}%</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-nowrap min-w-[80px]">{formatNumber(balanceNumber)}</p>
                  <div className="flex-1 relative h-2 rounded-full bg-quaternary overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="w-[96px] text-right">
                <p>$412.3K</p>
              </div> */}
              {addressUrl && (
                <i
                  className="icon-arrow-outward size-4 text-tertiary hover:text-primary cursor-pointer"
                  onClick={() => window.open(addressUrl, '_blank')}
                />
              )}
            </div>
          </CardTable.Row>
        );
      })}

      {totalForPagination > pagination.limit && (
        <CardTable.Pagination
          total={totalForPagination}
          skip={pagination.offset}
          limit={pagination.limit}
          onNext={() =>
            hasNextPage &&
            setPagination((prev) => ({
              ...prev,
              offset: prev.offset + prev.limit,
            }))
          }
          onPrev={() =>
            pagination.offset > 0 &&
            setPagination((prev) => ({
              ...prev,
              offset: Math.max(0, prev.offset - prev.limit),
            }))
          }
        />
      )}
    </CardTable.Root>
  );
}
