import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { Space } from "$lib/graphql/generated/backend/graphql";

export function useSpaceMenu({ space }: { space: Space }) {
  const pathname = usePathname();

  const menu = useMemo(() => {
    const menu = [{
      icon: 'icon-house-party',
      path: '',
      label: 'Home'
    }];

    if (space.lens_feed_id) {
      menu.push({
        icon: 'icon-newsfeed',
        path: 'timeline',
        label: 'Timeline'
      });
    }

    if (space.sub_spaces) {
      menu.push({
        icon: 'icon-sub-hubs',
        path: 'featured-hubs',
        label: 'Featured Hubs'
      });
    }

    return menu;
  }, [pathname, space]);

  const isActive = (item: { path: string }) => {
    const uid = space.slug || space._id;

    console.log(pathname);

    return item.path === '' ? pathname === `/s/${uid}` : pathname === `/s/${uid}/${item.path}`;
  }

  return { menu, isActive };
}
