'use client';

import { Spacer } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { WidgetContent } from './WidgetContent';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetCommunityCoin({ space, title, subtitle }: Props) {
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];

  return (
    <WidgetContent space={space} title="Community Coin" className="col-span-2">
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
    </WidgetContent>
  );
}
