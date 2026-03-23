'use client';

import { SettingsCommunityDisplay } from '$lib/components/features/community-manage/settings';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityDisplay space={ctx.space} />;
}

export default Page;
