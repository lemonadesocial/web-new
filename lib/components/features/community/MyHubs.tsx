import { GetSpacesDocument, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { userAvatar } from '$lib/utils/user';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';
import { HubCardItem, HubCardItemSkeleton } from './shared';

export function MyHubs() {
  const me = useMe();
  const { data, loading } = useQuery(GetSpacesDocument, {
    variables: {
      with_my_spaces: true,
      roles: [SpaceRole.Creator, SpaceRole.Admin],
    },
    fetchPolicy: 'cache-and-network',
  });
  const list = (data?.listSpaces || []) as Space[];

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.personal) src = userAvatar(me);
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <HubCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {list
        .sort((a, _) => (a.personal ? -1 : 1))
        .map((item) => (
          <HubCardItem
            key={item._id}
            title={item.title}
            view={isMobile ? 'list-item' : 'card'}
            onClick={() => (window.location.href = `/manage/community/${item.slug || item._id}`)}
            subtitle={`${item.followers_count || 0} Subscribers`}
            image={{
              src: getImageSrc(item),
              class: twMerge('rounded-sm', item.personal && 'rounded-full'),
            }}
          />
        ))}
    </div>
  );
}
