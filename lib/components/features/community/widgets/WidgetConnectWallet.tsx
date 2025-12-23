'use client';
import { useAppKitAccount } from '@reown/appkit/react';

import { Button, modal, Spacer } from '$lib/components/core';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { WidgetContent } from './WidgetContent';
import { ASSET_PREFIX } from '$lib/utils/constants';

interface Props {
  provider: string;
  title: string;
  subtitle: string;
}

export function WidgetConnectWallet({ provider, title, subtitle }: Props) {
  const { isConnected } = useAppKitAccount();

  return (
    <WidgetContent title="Wallet" className="col-span-2">
      {isConnected ? (
        'Content Wallet here'
      ) : (
        <div className="p-6 flex flex-col gap-5 relative">
          <div className="absolute top-0 left-0 right-0">
            <img
              src={`${ASSET_PREFIX}/assets/images/passports/templates/${provider}-wallet.png`}
              className="w-full h-full"
            />
          </div>

          <Spacer className="h-[88px]" />

          <div className="text-center">
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-tertiary">{subtitle}</p>
          </div>

          <Button variant="secondary" onClick={() => modal.open(ConnectWallet, { props: { onConnect: () => {} } })}>
            Connect Wallet
          </Button>
        </div>
      )}
    </WidgetContent>
  );
}
