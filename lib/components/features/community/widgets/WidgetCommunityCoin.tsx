'use client';

import { Button, Spacer } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { WidgetContent } from './WidgetContent';

interface Props {
  provider: string;
  title: string;
  subtitle: string;
}

export function WidgetCommunityCoin({ title, subtitle, provider }: Props) {
  return (
    <WidgetContent title="Community Coin">
      <div className="p-6 flex flex-col gap-5">
        <Button icon="icon-bell" variant="tertiary-alt" className="rounded-full absolute right-4 top-4" />
        <div className="absolute top-0 left-0 right-0">
          <img
            src={`${ASSET_PREFIX}/assets/images/passports/templates/${provider}-community-coin.png`}
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
