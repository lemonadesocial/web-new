'use client';
import React from 'react';
import { WidgetPassport } from './WidgetPassport';
import { WidgetCommunityCoin } from './WidgetCommunityCoin';
import { WidgetUpcomingEvents } from './WidgetUpcomingEvents';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { WidgetMusicNFT } from './WidgetMusicNFT';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function WidgetContainer({ space }: { space: Space }) {
  const provider = 'drip-nation';
  const config = {
    widgets: [
      {
        key: 'a',
        static: true,
        component: WidgetPassport,
        props: {
          provider: 'drip-nation',
          title: 'Become a Citizen',
          subtitle: 'Mint your Vinyl Passport and join a community built by music lovers, collectors, and creators.',
        },
      },
      {
        key: 'community-coin',
        component: WidgetCommunityCoin,
        props: {
          provider: 'drip-nation',
          title: '$VINYL',
          subtitle: 'Launching soon',
        },
      },
      {
        key: 'music-player',
        component: WidgetMusicNFT,
        props: {
          provider: 'drip-nation',
          title: '$VINYL',
          subtitle: 'Launching soon',
          space
        },
      },
      {
        key: 'upcomine-events',
        component: WidgetUpcomingEvents,
        props: {
          provider: 'drip-nation',
          space,
        },
      },
    ],
  };

  React.useEffect(() => {
    const main = document.getElementsByTagName('main')?.[0];
    // const child = main.getElementsByClassName('background')?.[0];
    // if (child) {
    //   main.removeChild(child);
    // }

    main.setAttribute('style', `background: url(${ASSET_PREFIX}/assets/images/passports/templates/${provider}-bg.png)`);
  }, []);

  return (
    <div data-coin-template className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {config.widgets.map((w) => {
        const Comp = w.component;

        return <Comp key={w.key} {...w.props} />;
      })}
    </div>
  );
}
