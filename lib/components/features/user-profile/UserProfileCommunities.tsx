'use client';
import { SearchSpacesDocument, Space, User } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { HubCardItem, HubCardItemSkeleton } from '../community/shared';
import { isMobile } from 'react-device-detect';

export function UserProfileCommunities({ user }: { user: User }) {
  const router = useRouter();
  const { data, loading } = useQuery(SearchSpacesDocument, {
    variables: { input: { user: user._id }, limit: 100, skip: 0 },
    skip: !user._id,
  });

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(5)].map((_, i) => (
          <HubCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {(data?.searchSpaces?.items || []).map((item) => (
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
