'use client';

import { CommunityAgents } from '$lib/components/features/community-manage/CommunityAgents';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityAgents space={ctx.space} />;
}

export default Page;
