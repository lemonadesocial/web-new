'use client';
import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

import { Badge, Button, modal, Spacer } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { Chain, Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import {
  useLaunchpadGroup,
  usePoolSwapPriceTimeSeries,
  useStakingAPR,
  useStakingCoin,
  useTokenData,
  useTokenIds,
} from '$lib/hooks/useCoin';
import { PoolCreated_Bool_Exp, PoolCreatedDocument } from '$lib/graphql/generated/coin/graphql';
import { useQuery } from '$lib/graphql/request';
import { Order_By } from '$lib/graphql/generated/username/graphql';
import { coinClient } from '$lib/graphql/request/instances';
import { WidgetContent } from './WidgetContent';
import { useAtomValue } from 'jotai';
import { chainsMapAtom } from '$lib/jotai';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetConnectWallet({ space, title, subtitle }: Props) {
  const { isConnected } = useAppKitAccount();
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];
  const { stakingToken, chain } = useStakingCoin(space._id);

  return (
    <WidgetContent
      space={space}
      title="Wallet"
      canSubscribe={!isConnected || !chain || !stakingToken}
      className="col-span-2"
    >
      {isConnected && chain && stakingToken ? (
        <ConnectedWalletContent chain={chain} address={stakingToken} spaceId={space._id} />
      ) : (
        <div className="p-6 flex flex-col gap-5 relative">
          <div className="absolute top-0 left-0 right-0">
            <img
              src={`${ASSET_PREFIX}/assets/images/passports/templates/${state.template.provider}-wallet.png`}
              className="w-full h-full"
            />
          </div>

          <Spacer className="h-[88px]" />

          <div className="text-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-tertiary">{subtitle}</p>
          </div>

          <Button variant="primary" onClick={() => modal.open(ConnectWallet, { props: { onConnect: () => {} } })}>
            Connect Wallet
          </Button>
        </div>
      )}
    </WidgetContent>
  );
}

function ConnectedWalletContent({ chain, address, spaceId }: { chain: Chain; address: string; spaceId: string }) {
  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { apr, isLoading } = useStakingAPR(chain, address);

  const { launchpadGroup } = useLaunchpadGroup(spaceId);
  const { tokenIds } = useTokenIds(launchpadGroup?.address || '');

  // usePoolSwapPriceTimeSeries

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
    <div className="flex h-full">
      <div className="flex-1 p-6 pb-5 flex justify-between">
        <div className="relative bg-(--btn-tertiary) text-(--btn-tertiary-content) size-16 aspect-square rounded-sm flex items-center justify-center">
          <i className="icon-account-balance-outline size-10 aspect-square"></i>
          {tokenData?.metadata?.imageUrl && (
            <img
              src={tokenData?.metadata.imageUrl}
              alt={tokenData?.name}
              className="size-6 aspect-square rounded-sm absolute bottom-0 right-0 object-cover"
            />
          )}
        </div>
        <div>
          <Badge title={`APR: ${apr}%`} color="var(--color-accent-500)" className="rounded-full" />
        </div>
      </div>
      <div className="flex-1 bg-(--btn-tertiary) px-6 py-5">
        <p className="text-tertiary">Balances</p>
        {tokenIds && tokenIds.length > 0 && <CoinList filter={filter} />}
      </div>
    </div>
  );
}

function CoinList({ filter }: { filter?: PoolCreated_Bool_Exp }) {
  const chainsMap = useAtomValue(chainsMapAtom);

  const { data, loading } = useQuery(
    PoolCreatedDocument,
    {
      variables: {
        orderBy: [
          {
            blockTimestamp: Order_By.Desc,
          },
        ],
        limit: 10,
        offset: 0,
        where: filter,
      },
    },
    coinClient,
  );
  const pools = data?.PoolCreated || [];
  console.log(pools);

  return (
    <div>
      {pools.map((item) => (
        <CointListItem key={item.id} chain={chainsMap[item.chainId]} address={item.memecoin} />
      ))}
    </div>
  );
}

function CointListItem({ chain, address }: { chain: Chain; address: string }) {
  const { tokenData } = useTokenData(chain, address);
  console.log(tokenData);
  return null;
  // return <img src={} />;
}
