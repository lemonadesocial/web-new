'use client';

import { CommunityNewsletter } from '$lib/components/features/community-manage/CommunityNewsletter';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityNewsletter spaceIdOrSlug={ctx.space.slug || ctx.space._id} />;
}

export default Page;
