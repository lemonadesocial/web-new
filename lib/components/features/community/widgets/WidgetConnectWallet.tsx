'use client';
import { useAppKitAccount } from '@reown/appkit/react';

import { Button, modal, Spacer } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { WidgetContent } from './WidgetContent';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderAction, useTheme } from '$lib/components/features/theme-builder/provider';
import { PassportTemplate } from '$lib/components/features/theme-builder/passports/types';

interface Props {
  space: Space;
  title: string;
  subtitle: string;
}

export function WidgetConnectWallet({ space, title, subtitle }: Props) {
  const { isConnected } = useAppKitAccount();
  const [state] = useTheme() as [PassportTemplate, React.Dispatch<ThemeBuilderAction>];

  return (
    <WidgetContent space={space} title="Wallet" className="col-span-2">
      {isConnected ? (
        'Content Wallet here'
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
