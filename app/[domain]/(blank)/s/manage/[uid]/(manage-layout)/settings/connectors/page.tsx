'use client';

import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';
import { Connectors } from '$lib/components/features/upgrade-to-pro/Connectors';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return (
    <div className="page mx-auto py-7">
      <Connectors space={ctx.space} />
    </div>
  );
}

export default Page;
