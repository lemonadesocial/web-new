'use client';

import { GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { useQuery } from '$lib/graphql/request';

export function AIList({ spaceId }: { spaceId: string }) {
  const { data, loading } = useQuery(GetListAiConfigDocument, {
    variables: { filter: { spaces_in: [spaceId] } },
    skip: !spaceId,
  });

  return <div className="p"></div>;
}
