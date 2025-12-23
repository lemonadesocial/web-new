'use client';

import { Spacer } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { WidgetContent } from './WidgetContent';

interface Props {
  provider: string;
  title: string;
  subtitle: string;
}

export function WidgetCollectibles({ provider, title, subtitle }: Props) {
  return (
    <WidgetContent title="Collectibles">
      <div className="p-6 flex items-center flex-col gap-5 relative">
        <div className="absolute top-0 left-0 right-0">
          <img src={`${ASSET_PREFIX}/assets/images/passports/templates/${provider}-collectibles.png`} />
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
