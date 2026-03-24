'use client';

import { CommunityPayments } from '$lib/components/features/community-manage/CommunityPayments';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityPayments space={ctx.space} />;
}

export default Page;
