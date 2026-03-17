'use client';

import { SettingsCommunityDeveloper } from '$lib/components/features/community-manage/settings/SettingsCommunityDeveloper';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityDeveloper space={ctx.space} />;
}

export default Page;
