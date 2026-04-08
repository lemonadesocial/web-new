'use client';

import { useParams } from 'next/navigation';

import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';
import { Connectors } from '$lib/components/features/upgrade-to-pro/Connectors';

export function Page() {
  const ctx = useCommunityManageSpace();
  const params = useParams<{ uid: string }>();
  if (!ctx) return null;

  return (
    <div className="page mx-auto py-7">
      <Connectors space={ctx.space} basePath={`/s/manage/${params.uid}/settings/connectors`} />
    </div>
  );
}

export default Page;
