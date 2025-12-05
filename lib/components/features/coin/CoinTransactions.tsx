'use client';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';
import { ethers } from 'ethers';

import { useQuery } from '$lib/graphql/request/hooks';
import { coinClient } from '$lib/graphql/request/instances';
import { PoolSwapDocument, Order_By, type PoolSwap } from '$lib/graphql/generated/coin/graphql';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { CardTable } from '$lib/components/core/table';
import { Skeleton, Chip } from '$lib/components/core';
import { formatWallet, getTransactionUrl } from '$lib/utils/crypto';
import { formatNumber } from '$lib/utils/number';
import { useTokenData } from '$lib/hooks/useCoin';

type PoolSwapItem = Omit<PoolSwap, 'chainId'>;

interface CoinTransactionsProps {
  chain: Chain;
  address: string;
}

function TransactionRow({
  swap,
  chain,
  isEthToken0,
}: {
  swap: PoolSwapItem;
  chain: Chain;
  isEthToken0: boolean | null;
}) {
  const [fromAddress, setFromAddress] = React.useState<string | null>(null);
  const [isLoadingFrom, setIsLoadingFrom] = React.useState(true);

  React.useEffect(() => {
    const fetchFromAddress = async () => {
      if (!chain?.rpc_url) {
        setIsLoadingFrom(false);
        return;
      }

      try {
        const provider = new ethers.JsonRpcProvider(chain.rpc_url);
        const transaction = await provider.getTransaction(swap.transactionHash);
        
        if (transaction?.from) {
          setFromAddress(transaction.from);
        }
      } catch (error) {
        console.error('Failed to fetch transaction from address:', error);
      } finally {
        setIsLoadingFrom(false);
      }
    };

    fetchFromAddress();
  }, [chain, swap.transactionHash]);

  if (isEthToken0 === null) {
    return null;
  }

  const ispAmount0 = BigInt(swap.ispAmount0 || '0');
  const ispAmount1 = BigInt(swap.ispAmount1 || '0');
  const flAmount0 = BigInt(swap.flAmount0 || '0');
  const flAmount1 = BigInt(swap.flAmount1 || '0');
  const uniAmount0 = BigInt(swap.uniAmount0 || '0');
  const uniAmount1 = BigInt(swap.uniAmount1 || '0');
  const ispFee0 = BigInt(swap.ispFee0 || '0');
  const ispFee1 = BigInt(swap.ispFee1 || '0');
  const flFee0 = BigInt(swap.flFee0 || '0');
  const flFee1 = BigInt(swap.flFee1 || '0');
  const uniFee0 = BigInt(swap.uniFee0 || '0');
  const uniFee1 = BigInt(swap.uniFee1 || '0');

  const totalAmount0 = (ispAmount0 + flAmount0 + uniAmount0) - (ispFee0 + flFee0 + uniFee0);
  const totalAmount1 = (ispAmount1 + flAmount1 + uniAmount1) - (ispFee1 + flFee1 + uniFee1);

  const ethAmount = isEthToken0 ? totalAmount0 : totalAmount1;
  const tokenAmount = isEthToken0 ? totalAmount1 : totalAmount0;

  const isBuy = ethAmount < BigInt(0);

  const ethAmountAbs = ethAmount < BigInt(0) ? -ethAmount : ethAmount;
  const tokenAmountAbs = tokenAmount < BigInt(0) ? -tokenAmount : tokenAmount;

  const ethValue = formatEther(ethAmountAbs);
  const tokenValue = formatEther(tokenAmountAbs);

  const timestamp = Number(swap.blockTimestamp) * 1000;
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  const txUrl = getTransactionUrl(chain, swap.transactionHash);

  return (
    <CardTable.Row key={swap.blockNumber}>
      <div className="flex gap-3 px-4 py-3 items-center justify-between text-tertiary hover:bg-(--btn-tertiary)">
        <div className="w-[60px]">
          <Chip size="xs" variant={isBuy ? 'success' : 'error'}>
            {isBuy ? 'Buy' : 'Sell'}
          </Chip>
        </div>
        <div className="flex-1">
          {isLoadingFrom ? (
            <Skeleton className="h-5 w-24" animate />
          ) : fromAddress ? (
            <p className="text-primary">{formatWallet(fromAddress, 4)}</p>
          ) : (
            <p className="text-tertiary">N/A</p>
          )}
        </div>
        <div className="flex-1">
          <p>{formatNumber(Number(ethValue))}</p>
        </div>
        <div className="flex-1">
          <p>{formatNumber(Number(tokenValue), true)}</p>
        </div>
        <div className="w-[144px]">
          <p>{timeAgo}</p>
        </div>
        {txUrl && (
          <i
            className="icon-arrow-outward size-4 text-tertiary hover:text-primary cursor-pointer"
            onClick={() => window.open(txUrl, '_blank')}
          />
        )}
      </div>
    </CardTable.Row>
  );
}

export function CoinTransactions({ chain, address }: CoinTransactionsProps) {
  const [poolId, setPoolId] = React.useState<string | null>(null);
  const [isLoadingPoolId, setIsLoadingPoolId] = React.useState(true);
  const [isEthToken0, setIsEthToken0] = React.useState<boolean | null>(null);
  const [pagination, setPagination] = React.useState<{ limit: number; offset: number }>({
    limit: 10,
    offset: 0,
  });

  const { tokenData } = useTokenData(chain, address);

  React.useEffect(() => {
    const fetchPoolId = async () => {
      setIsLoadingPoolId(true);
      const flaunchClient = FlaunchClient.getInstance(chain, address);
      const poolIdValue = await flaunchClient.getPoolId();
      setPoolId(poolIdValue);
      
      const nativeToken = await flaunchClient.getLETHAddress();
      const isNativeToken0 = nativeToken.toLowerCase().localeCompare(address.toLowerCase()) <= 0;
      setIsEthToken0(isNativeToken0);
      
      setIsLoadingPoolId(false);
    };

    fetchPoolId();
  }, [chain, address]);

  const { data, loading } = useQuery(
    PoolSwapDocument,
    {
      variables: poolId
        ? {
            where: {
              poolId: {
                _eq: poolId,
              },
              chainId: {
                _eq: Number(chain.chain_id),
              },
            },
            orderBy: {
              blockTimestamp: Order_By.Desc,
            },
            limit: pagination.limit,
            offset: pagination.offset,
          }
        : undefined,
      skip: !poolId || isLoadingPoolId,
      fetchPolicy: 'network-only',
    },
    coinClient,
  );

  const swaps = data?.PoolSwap || [];
  const isLoading = isLoadingPoolId || loading;
  const hasNextPage = swaps.length === pagination.limit;
  const totalForPagination = hasNextPage
    ? pagination.offset + pagination.limit + 1
    : pagination.offset + swaps.length;

  return (
    <CardTable.Root loading={isLoading} data={swaps}>
      <CardTable.Header>
        <div className="flex gap-3 px-4 py-3 w-full">
          <p className="w-[60px]">Action</p>
          <p className="flex-1">Made By</p>
          <p className="flex-1">ETH</p>
          <p className="flex-1">{tokenData?.symbol ?? 'Token'}</p>
          <p className="w-[144px]">Date</p>
          <p className="w-[16px]"></p>
        </div>
      </CardTable.Header>

      <CardTable.Loading rows={10}>
        <Skeleton className="h-6 w-[60px] rounded-full" animate />
        <Skeleton className="h-5 flex-1" animate />
        <Skeleton className="h-5 flex-1" animate />
        <Skeleton className="h-5 flex-1" animate />
        <Skeleton className="h-5 w-[144px]" animate />
      </CardTable.Loading>

      <CardTable.EmptyState
        icon="icon-lab-profile"
        title="No Transactions"
        subtile="Trades and activity for this coin will appear here once things get moving."
      />

      {swaps.map((swap) => (
        <TransactionRow
          key={swap.blockNumber}
          swap={swap}
          chain={chain}
          isEthToken0={isEthToken0}
          tokenData={tokenData}
        />
      ))}

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

