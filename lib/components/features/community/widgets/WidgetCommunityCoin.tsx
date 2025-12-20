'use client';

import { Button } from '$lib/components/core';
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
      <div
        className="min-w-full min-h-full"
        style={{
          backgroundImage: `url(${'https://localhost.staging.lemonade.social:8000' || ASSET_PREFIX}/assets/passports/${provider}-community-coin-bg.png)`,
        }}
      >
        <Button icon="icon-bell" variant="tertiary-alt" className="rounded-full absolute right-4 top-4" />
      </div>

      <div className="text-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-tertiary">{subtitle}</p>
      </div>
    </WidgetContent>
  );
}
