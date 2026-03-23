'use client';

import { CommunityOverview } from '$lib/components/features/community-manage/CommunityOverview';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityOverview space={ctx.space} hostname={ctx.hostname} />;
}

export default Page;
