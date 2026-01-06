'use client';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { Button, toast } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';

import { usePassports } from '$lib/hooks/usePassports';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';
import { WidgetContent } from './WidgetContent';
import { useLemonadeUsername } from '$lib/hooks/useUsername';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetPassport({ space, title, subtitle }: Props) {
  const router = useRouter();
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];
  const { data } = usePassports(state.template.provider);

  // TODO: need to find another way to load username - it could be different username
  const { username } = useLemonadeUsername();

  return (
    <WidgetContent
      space={space}
      title="Passport"
      canSubscribe={false}
      className={clsx('w-full col-span-2', !!data?.tokenId ? 'row-span-1' : 'row-span-2')}
    >
      {!!data?.tokenId ? (
        <div className="flex gap-8 p-6">
          <div className="flex flex-1 justify-between flex-col">
            <div className="space-y-1">
              <div className="text-xl font-semibold">
                <h3>{state.template.passportTitle}</h3>
                <h3>#{data.tokenId}</h3>
              </div>
              <p className="text-tertiary">@{username}</p>
            </div>
            <Button
              icon="icon-share"
              variant="tertiary-alt"
              className="rounded-full w-fit"
              onClick={() => toast.success('Comming soon')}
            />
          </div>
          <img src={data.image} className="w-[365px] h-[228px]" />
        </div>
      ) : (
        <div className="flex flex-col gap-12 p-12">
          <img src={`${ASSET_PREFIX}/assets/images/passports/${state.template.provider}-passport-mini.png`} />
          <div className="flex flex-col gap-6 text-center items-center">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p>{subtitle}</p>
            </div>

            <Button
              className="rounded-full w-fit"
              variant="primary"
              onClick={() => router.push(`/passport/${state.template.provider}`)}
            >
              Mint Passport
            </Button>
          </div>
        </div>
      )}
    </WidgetContent>
  );
}
