'use client';
import { Button } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { WidgetContent } from './WidgetContent';

interface Props {
  provider: string;
  title: string;
  subtitle: string;
}

export function WidgetPassport({ provider, title, subtitle }: Props) {
  return (
    <WidgetContent title="Passport" className="w-full row-span-2">
      <div className="flex flex-col gap-12 p-12">
        <img src={`${ASSET_PREFIX}/assets/images/passports/${provider}-passport-mini.png`} />
        <div className="flex flex-col gap-6 text-center items-center">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <p>{subtitle}</p>
          </div>

          <Button className="rounded-full w-fit" variant="primary">
            Mint Passport
          </Button>
        </div>
      </div>
    </WidgetContent>
  );
}
