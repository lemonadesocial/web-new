'use client';
import React from 'react';

import { Chain, Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { useLaunchpadGroup, usePoolSwapPriceTimeSeries, useTokenData, useTokenIds } from '$lib/hooks/useCoin';
import { PoolCreated, PoolCreated_Bool_Exp, PoolCreatedDocument } from '$lib/graphql/generated/coin/graphql';

import { WidgetContent } from './WidgetContent';
import { useQuery } from '$lib/graphql/request';
import { Order_By } from '$lib/graphql/generated/username/graphql';
import { coinClient } from '$lib/graphql/request/instances';
import { useAtomValue } from 'jotai';
import { chainsMapAtom } from '$lib/jotai';
import { formatNumber } from '$lib/utils/number';
import clsx from 'clsx';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetLaunchpad({ space, title, subtitle }: Props) {
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];

  const { launchpadGroup } = useLaunchpadGroup(space?._id || '');
  const { tokenIds } = useTokenIds(launchpadGroup?.address || '');

  const filter = React.useMemo<PoolCreated_Bool_Exp | undefined>(() => {
    if (!tokenIds || tokenIds.length === 0) {
      return undefined;
    }
    return {
      tokenId: {
        _in: tokenIds,
      },
    };
  }, [tokenIds]);

  return (
    <WidgetContent space={space} title="Launchpad" canSubscribe={!tokenIds} className="grid-cols-1">
      {tokenIds && tokenIds?.length > 0 ? (
        <LaunpadDetail filter={filter} />
      ) : (
        <div className="p-6 flex items-center flex-col gap-5 relative">
          <img src={`${ASSET_PREFIX}/assets/images/passports/templates/${state.template.provider}-launchpad.png`} />

          <div className="text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-tertiary">{subtitle}</p>
          </div>
        </div>
      )}
    </WidgetContent>
  );
}

const LIMIT = 10;
function LaunpadDetail({ filter }: { filter?: PoolCreated_Bool_Exp }) {
  const [skip] = React.useState(0);
  const chainsMap = useAtomValue(chainsMapAtom);

  const { data } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        limit: LIMIT,
        offset: skip,
        where: filter,
      },
    },
    coinClient,
  );

  const pools = data?.PoolCreated || [];
  return (
    <div className="space-y-2 p-5">
      {pools.map((item) => (
        <CoinDetail key={item.id} chain={chainsMap[item.chainId]} pool={item} />
      ))}
    </div>
  );
}

function CoinDetail({ pool, chain }: { chain: Chain; pool: PoolCreated }) {
  const { tokenData } = useTokenData(chain, pool.memecoin);
  const { data } = usePoolSwapPriceTimeSeries(chain, pool.memecoin, { limit: 2 });

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img
          src={tokenData?.metadata?.imageUrl}
          alt={tokenData?.metadata?.name}
          className="size-4 aspect-square rounded-xs"
        />
        <p>${tokenData?.symbol}</p>
      </div>
      <p className={clsx(data?.[0]?.price > data?.[1]?.price ? 'text-success-500' : 'text-danger-500')}>
        ${formatNumber(data?.[0]?.price || 0, false)}
      </p>
    </div>
  );
}
