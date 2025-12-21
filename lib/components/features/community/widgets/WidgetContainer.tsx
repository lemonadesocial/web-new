'use client';

import { WidgetPassport } from './WidgetPassport';
import { WidgetCommunityCoin } from './WidgetCommunityCoin';
import { WidgetUpcomingEvents } from './WidgetUpcomingEvents';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { WidgetMusicNFT } from './WidgetMusicNFT';

export function WidgetContainer({ space }: { space: Space }) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {config.widgets.map((w) => {
        const Comp = w.component;

        return <Comp key={w.key} {...w.props} />;
      })}
    </div>
  );
}
