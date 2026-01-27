import { Metadata, ResolvingMetadata } from 'next';

import CommunityLayout from '$lib/components/layouts/community';
import { getSpace } from '$lib/utils/getSpace';

type Props = { params: Promise<{ domain: string }> };

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const res = await params;
  const domain = decodeURIComponent(res.domain);

  const space = await getSpace({ hostname: domain });

  const metadata: Metadata = {};

  if (space?.fav_icon_url) {
    metadata.icons = {
      icon: space.fav_icon_url,
      shortcut: space.fav_icon_url,
      apple: space.fav_icon_url,
    };
  }

  return metadata;
}

export default CommunityLayout;
