'use client';

import { SettingsCommunitySubscription } from '$lib/components/features/community-manage/settings/SettingsCommunitySubscription';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunitySubscription space={ctx.space} />;
}

export default Page;
