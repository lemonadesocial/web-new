'use client';

import { SettingsCommunityAvanced } from '$lib/components/features/community-manage/settings/SettingsCommunityAvanced';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityAvanced space={ctx.space} />;
}

export default Page;
