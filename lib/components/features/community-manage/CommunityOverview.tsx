'use client';

import { useQuery } from '$lib/graphql/request';
import { GetSpaceDocument } from '$lib/graphql/generated/backend/graphql';

import { isObjectId } from '$lib/utils/helpers';
import { useParams } from 'next/navigation';

export function CommunityOverview() {
  const params = useParams<{ uid: string }>();

  const variables = isObjectId(params.uid) ? { id: params.uid, slug: params.uid } : { slug: params.uid };
  const { data, loading } = useQuery(GetSpaceDocument, { variables });
  
  return (
    <div>
      <h1>Community Overview</h1>
    </div>
  );
}
