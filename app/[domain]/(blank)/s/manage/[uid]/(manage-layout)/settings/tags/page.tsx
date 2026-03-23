'use client';

import { SettingsCommunityTags } from '$lib/components/features/community-manage/settings/SettingsCommunityTags';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityTags space={ctx.space} />;
}

export default Page;
