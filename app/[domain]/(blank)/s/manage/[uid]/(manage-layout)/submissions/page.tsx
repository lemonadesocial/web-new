'use client';

import { CommunitySubmissions } from '$lib/components/features/community-manage/CommunitySubmissions';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunitySubmissions space={ctx.space} />;
}

export default Page;
