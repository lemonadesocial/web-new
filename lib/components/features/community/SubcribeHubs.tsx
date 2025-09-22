import { GetSpacesDocument, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { HubCardItem, HubCardItemSkeleton } from './shared';
import { isMobile } from 'react-device-detect';

export function SubcribeHubs() {
  const router = useRouter();
  const { data, loading } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: false, roles: [SpaceRole.Subscriber] },
    fetchPolicy: 'cache-and-network',
  });
  const list = (data?.listSpaces || []) as Space[];

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, i) => (
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
            view={isMobile ? 'list-item' : 'card'}
            title={item.title}
            image={{ src: getImageSrc(item), class: 'rounded-sm' }}
            onClick={() => router.push(`/s/${item.slug || item._id}`)}
          />
        ))}
    </div>
  );
}
