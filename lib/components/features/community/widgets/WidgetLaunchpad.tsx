'use client';
import { Spacer } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { WidgetContent } from './WidgetContent';

interface Props {
  provider: string;
  title: string;
  subtitle: string;
}

export function WidgetLaunchpad({ provider, title, subtitle }: Props) {
  return (
    <WidgetContent title="Launchpad" className="grid-cols-1">
      <div className="p-6 flex items-center flex-col gap-5 relative">
        <img src={`${ASSET_PREFIX}/assets/images/passports/templates/${provider}-launchpad.png`} />

        <div className="text-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-tertiary">{subtitle}</p>
        </div>
      </div>
    </WidgetContent>
  );
}
