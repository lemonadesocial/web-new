'use client';
import React from 'react';

import { Button, Skeleton } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { GetSpacesDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { communityAvatar } from '$lib/utils/community';
import { match } from 'ts-pattern';

export function FeaturedCommunityHubs() {
  const { data, loading } = useQuery(GetSpacesDocument, { variables: { featured: true } });
  const list = (data?.listSpaces || []) as Space[];

  return (
    <div className="flex flex-col gap-5 relative">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">Featured Communities</p>
        <Button variant="tertiary-alt" size="sm" iconRight="icon-arrow-back-sharp rotate-180">
          View All
        </Button>
      </div>

      {match(loading)
        .with(true, () => (
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[384px] flex flex-col gap-3 p-4 rounded-md border-card-border bg-card">
                <Skeleton animate className="w-12 h-12 rounded-sm" />
                <Skeleton animate className="h-[28px] w-[200px]" />
                <Skeleton animate className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))
        .otherwise(() => (
          <div className="grid grid-cols-3 gap-4">
            {list.slice(0, 6).map((item, idx) => (
              <FeaturedCommunityHubsItem key={idx} space={item} />
            ))}
          </div>
        ))}
    </div>
  );
}

function FeaturedCommunityHubsItem({ space }: { space: Space }) {
  return (
    <div className="min-w-[384px] flex flex-col gap-3 p-4 rounded-md border-card-border bg-card">
      <img src={communityAvatar(space)} className="w-12 h-12 object-cover rounded-sm border-card-border" />
      <h3 className="text-lg font-semibold">{space.title}</h3>
      {space.description && <p className="text-sm text-tertiary line-clamp-2">{space.description as string}</p>}
    </div>
  );
}
