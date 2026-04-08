'use client';

import { useParams } from 'next/navigation';

import { useCommunityManageSpace } from '$lib/components/features/community-manage/CommunityManageSpaceContext';
import { ConnectorDetail } from '$lib/components/features/upgrade-to-pro/ConnectorDetail';

export function Page() {
  const ctx = useCommunityManageSpace();
  const params = useParams<{ uid: string; id: string }>();

  if (!ctx) return null;

  return (
    <div className="page mx-auto py-7">
      <ConnectorDetail
        spaceId={ctx.space._id}
        connectionId={params.id}
        basePath={`/s/manage/${params.uid}/connectors`}
      />
    </div>
  );
}

export default Page;
