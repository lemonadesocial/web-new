'use client';

import { SettingsCommunityTeam } from '$lib/components/features/community-manage/settings/SettingsCommunityTeam';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityTeam space={ctx.space} />;
}

export default Page;
