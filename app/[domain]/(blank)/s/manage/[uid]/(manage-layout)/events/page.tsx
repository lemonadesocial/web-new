'use client';

import { CommunityEvents } from '$lib/components/features/community-manage/CommunityEvents';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityEvents space={ctx.space} />;
}

export default Page;
