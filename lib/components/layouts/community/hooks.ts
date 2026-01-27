import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { useStakingCoin } from '$lib/hooks/useCoin';

export function useSpaceMenu({ space, isMobile }: { space: Space; isMobile?: boolean }) {
  const pathname = usePathname();
  const { stakingToken } = useStakingCoin(space._id);

  const menu = useMemo(() => {
    let menu = [];

    if (space.slug === 'lemonheads') {
      menu = [
        { icon: 'icon-home', path: '', label: 'Home' },
        { icon: 'icon-ticket', path: 'events', label: 'Events' },
        { icon: 'icon-sub-hubs', path: 'featured-hubs', label: 'Featured Hubs' },
        { icon: 'icon-account-balance-outline', path: 'treasury', label: 'Treasury' },
        { icon: 'icon-bar-chart', path: 'leaderboards', label: 'Leaderboard' },
      ];

      if (isMobile) {
        menu = [
          { icon: 'icon-home', path: '', label: 'Home' },
          { icon: 'icon-ticket', path: 'events', label: 'Events' },
          { icon: 'icon-bar-chart', path: 'leaderboards', label: 'Leaderboard' },
        ];
      }
    } else {
      menu = [
        {
          icon: !space.theme_name || space.theme_name === 'default' ? 'icon-house-party' : 'icon-home',
          path: '',
          label: 'Home',
        },
      ];

      if (space.theme_name && space.theme_name !== 'default') {
        menu.push({ icon: 'icon-ticket', path: 'events', label: 'Events' });
      }

      if (space.lens_feed_id) {
        menu.push({
          icon: 'icon-newsfeed',
          path: 'timeline',
          label: 'Timeline',
        });
      }

      if (stakingToken) {
        menu.push(
          {
            icon: 'icon-token',
            path: 'coin',
            label: 'Community Coin',
          },
          {
            icon: 'icon-rocket',
            path: 'launchpad',
            label: 'Launchpad',
          },
        );
      }

      if (space.sub_spaces) {
        menu.push({
          icon: 'icon-sub-hubs',
          path: 'featured-hubs',
          label: 'Featured Hubs',
        });
      }
    }

    return menu;
  }, [pathname, space, isMobile, stakingToken]);

  const isActive = (item: { path: string }) => {
    const uid = space.slug || space._id;
    return item.path === '' ? pathname === `/s/${uid}` : pathname === `/s/${uid}/${item.path}`;
  };

  return { menu, isActive };
}
