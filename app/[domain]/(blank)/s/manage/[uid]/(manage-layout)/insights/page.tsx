'use client';

import { CommunityInsightsOverview } from '$lib/components/features/community-manage/CommunityInsightsOverview';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export default function InsightsOverviewPage() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityInsightsOverview space={ctx.space} />;
}
