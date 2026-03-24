'use client';

import { SettingsCommunityEmbed } from '$lib/components/features/community-manage/settings/SettingsCommunityEmbed';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export function Page() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <SettingsCommunityEmbed space={ctx.space} />;
}

export default Page;
