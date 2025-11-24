
'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Divider, HorizontalScroll, Skeleton } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import {
  GetListGeoRegionsDocument,
  GetListSpaceCategoriesDocument,
  GetSpacesDocument,
  Space,
} from '$lib/graphql/generated/backend/graphql';
import { useRouter } from 'next/navigation';
import { generateUrl } from '$lib/utils/cnd';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { communityAvatar } from '$lib/utils/community';


export function FeaturedCommunityHubs() {
  const router = useRouter();
  const { data, loading } = useQuery(GetSpacesDocument, { variables: { featured: true } });
  const list = (data?.listSpaces || []) as Space[];

  if (loading) {
    return (
      <div className="flex flex-col gap-4 relative">
        <p className="text-xl font-semibold">Featured Communities</p>
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="min-w-[384px] flex flex-col gap-3 p-4 rounded-md border-card-border bg-card">
              <Skeleton animate className="w-12 h-12 rounded-sm" />
              <Skeleton animate className="h-[28px] w-[200px]" />
              <Skeleton animate className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      <p className="text-xl font-semibold">Featured Communities</p>
      <div className='flex gap-4 overflow-y-auto no-scrollbar'>
        {list.map((item, idx) => (
          <FeaturedCommunityHubsItem  
            key={idx}
            space={item}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedCommunityHubsItem({ space }: { space: Space }) {
  return (
    <div className="min-w-[384px] flex flex-col gap-3 p-4 rounded-md border-card-border bg-card">
      <img src={communityAvatar(space)} className="w-12 h-12 object-cover rounded-sm border-card-border" />
      <h3 className="text-lg font-semibold">{space.title}</h3>
      {
        space.description && (
          <p className="text-sm text-tertiary line-clamp-2">{space.description as string}</p>
        )
      }
    </div>
  );
}

