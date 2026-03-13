'use client';

import { SettingsCommunityApiKeys } from '$lib/components/features/community-manage/settings/SettingsCommunityApiKeys';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityApiKeys space={ctx.space} />;
}

export default Page;
