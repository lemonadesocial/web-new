'use client';

import { CommunityPeople } from '$lib/components/features/community-manage/CommunityPeople';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityPeople space={ctx.space} />;
}

export default Page;
