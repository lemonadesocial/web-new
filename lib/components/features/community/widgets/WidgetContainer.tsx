'use client';
import React from 'react';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeBuilderActionKind, useTheme } from '$lib/components/features/theme-builder/provider';
import vinylPassportConfig from '$lib/components/features/theme-builder/passports/vinyl-nation';

export function WidgetContainer({ space }: { space: Space }) {
  const [state, dispatch] = useTheme();

  React.useEffect(() => {
    // const config = {
    //   provider,
    //   template: 'passport',
    //   passportTitle: 'Citizen',
    //   image: `${ASSET_PREFIX}/assets/images/passports/templates/${state.provider}-bg.png`,
    //   widgets: [
    //     {
    //       key: 'passport',
    //       static: true,
    //       component: WidgetPassport,
    //       props: {
    //         space,
    //         provider,
    //         title: 'Become a Citizen',
    //         subtitle: 'Mint your Vinyl Passport and join a community built by music lovers, collectors, and creators.',
    //       },
    //     },
    //     {
    //       key: 'community-coin',
    //       component: WidgetCommunityCoin,
    //       props: {
    //         space,
    //
    //         provider,
    //         title: '$VINYL',
    //         subtitle: 'Launching soon',
    //       },
    //     },
    //     {
    //       key: 'music-player',
    //       component: WidgetMusicNFT,
    //       props: {
    //         space,
    //         provider,
    //         title: '$VINYL',
    //         subtitle: 'Launching soon',
    //       },
    //     },
    //     {
    //       key: 'upcoming-events',
    //       component: WidgetUpcomingEvents,
    //       props: {
    //         provider,
    //         space,
    //       },
    //     },
    //     {
    //       key: 'wallet',
    //       component: WidgetConnectWallet,
    //       props: {
    //         space,
    //         provider,
    //         title: 'Connect Wallet',
    //         subtitle: 'Connect your wallet to access your tokens and rewards.',
    //       },
    //     },
    //     {
    //       key: 'launchpad',
    //       component: WidgetLaunchpad,
    //       props: {
    //         space,
    //         provider,
    //         title: 'Artist Coins',
    //         subtitle: 'Connect Wallet',
    //       },
    //     },
    //     {
    //       key: 'collectibles',
    //       component: WidgetCollectibles,
    //       props: {
    //         space,
    //         provider,
    //         title: 'DRiP NFT Marketplace',
    //         subtitle: 'Coming soon',
    //       },
    //     },
    //   ],
    // };

    const config = vinylPassportConfig;
    dispatch({ type: ThemeBuilderActionKind.select_template, payload: { ...config } });
  }, []);

  return (
    <div data-coin-template className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {'template' in state &&
        state.template.widgets?.map((w) => {
          const Comp = w.component;

          return <Comp key={w.key} space={space} {...w.props} />;
        })}
    </div>
  );
}
