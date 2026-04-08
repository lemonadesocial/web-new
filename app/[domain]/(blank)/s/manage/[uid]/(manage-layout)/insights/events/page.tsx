'use client';

import { CommunityInsightsEvents } from '$lib/components/features/community-manage/CommunityInsightsEvents';
import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';

export default function InsightsEventsPage() {
  const ctx = useCommunityManageSpace();
  if (!ctx) return null;

  return <CommunityInsightsEvents space={ctx.space} />;
}
