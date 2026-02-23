'use client';
import React from 'react';
import { Spacer } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import { WidgetContent } from './WidgetContent';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetCollectibles({ space, title, subtitle }: Props) {
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];

  return (
    <WidgetContent space={space} title="Collectibles" className="max-sm:col-span-2">
      <div className="p-6 flex items-center flex-col gap-5 relative">
        <div className="absolute top-0 left-0 right-0">
          <img src={`${ASSET_PREFIX}/assets/images/passports/templates/${state.template.provider}-collectibles.png`} alt="Collectibles template" />
        </div>

        <Spacer className="h-[152px]" />

        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-tertiary">{subtitle}</p>
        </div>
      </div>
    </WidgetContent>
  );
}
