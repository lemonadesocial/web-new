'use client';
import React from 'react';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { useLaunchpadGroup, usePoolSwapPriceTimeSeries, useTokenIds } from '$lib/hooks/useCoin';
import { PoolCreated_Bool_Exp } from '$lib/graphql/generated/coin/graphql';

import { WidgetContent } from './WidgetContent';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetLaunchpad({ space, title, subtitle }: Props) {
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];

  const { launchpadGroup } = useLaunchpadGroup(space?._id || '');
  const { tokenIds } = useTokenIds(launchpadGroup?.address || '');
  console.log(tokenIds);

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
    <WidgetContent space={space} title="Launchpad" className="grid-cols-1">
      <div className="p-6 flex items-center flex-col gap-5 relative">
        <img src={`${ASSET_PREFIX}/assets/images/passports/templates/${state.template.provider}-launchpad.png`} />

        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-tertiary">{subtitle}</p>
        </div>
      </div>
    </WidgetContent>
  );
}
