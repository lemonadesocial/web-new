'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Divider } from '$lib/components/core';
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

import { PageCardItem, PageSection } from '../shared';
import { isMobile } from 'react-device-detect';

export function Content() {
  return (
    <div className="flex flex-col gap-6 py-8">
      <PageSection title="Browse by Category">
        <BrowseByCategories />
      </PageSection>
      <Divider className="my-2" />
      <PageSection title="Featured Community Hubs">
        <FeaturedCommunityHub />
      </PageSection>
      <Divider className="my-2" />
      <PageSection title="Explore Local Events">
        <ExploreLocalEvents />
      </PageSection>
    </div>
  );
}

function BrowseByCategories() {
  const router = useRouter();
  const { data } = useQuery(GetListSpaceCategoriesDocument);
  const list = data?.listSpaceCategories || [];

  return (
    <div className="flex overflow-x-auto md:w-full md:grid lg:grid-cols-3 gap-4 no-scrollbar">
      {list.map((item, idx) => (
        <PageCardItem
          key={idx}
          containerClass="min-w-[144px]"
          title={item.title}
          onClick={() => router.push(`/s/${item.space}`)}
          subtitle={`${item.listed_events_count || 0} Events`}
          image={{ src: item.image_url as string }}
        />
      ))}
    </div>
  );
}

function FeaturedCommunityHub() {
  const router = useRouter();
  const { data } = useQuery(GetSpacesDocument, { variables: { featured: true } });
  const list = (data?.listSpaces || []) as Space[];

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {list.map((item, idx) => (
        <PageCardItem
          key={idx}
          view={isMobile ? 'list-item' : 'card'}
          title={item.title}
          onClick={() => router.push(`/s/${item.slug || item._id}`)}
          subtitle={item.description as string}
          image={{ src: getImageSrc(item), class: 'rounded-sm' }}
        />
      ))}
    </div>
  );
}

const COLORS = [
  '#6C85EE',
  '#EF7248',
  '#6FB983',
  '#62B5CA',
  '#F5A623',
  '#9B51E0',
  '#D76666',
  '#F5A623',
  '#9B51E0',
  '#D76666',
  '#6C85EE',
  '#EF7248',
  '#6FB983',
  '#62B5CA',
  '#F5A623',
  '#9B51E0',
  '#D76666',
];

function ExploreLocalEvents() {
  const router = useRouter();
  const formatEventCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K Events`;
    }
    if (count === 1) return '1 Event';
    return `${count} Events`;
  };

  const { data } = useQuery(GetListGeoRegionsDocument);
  const regions = data?.listGeoRegions || [];

  const [selected, setSelected] = React.useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex overflow-x-auto no-scrollbar">
        {regions.map((item, idx) => (
          <div
            key={idx}
            className={twMerge(
              'rounded-sm text-tertiary hover:text-primary text-sm font-semibold cursor-pointer px-2.5 py-1.5 max-h-8 whitespace-nowrap',
              selected === idx && 'text-primary bg-[var(--btn-tertiary)]',
            )}
            onClick={() => setSelected(idx)}
          >
            {item.title}
          </div>
        ))}
      </div>

      <div className="overflow-auto no-scrollbar">
        <div className="grid grid-cols-5 auto-cols-max gap-3" style={{ width: 'max-content' }}>
          {regions?.[selected]?.cities?.map((city, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-center cursor-pointer px-3.5 py-2.5 hover:bg-[var(--btn-tertiary)] min-w-[180px] shrink-0 rounded-md"
              onClick={() => router.push(`/s/${city.space}`)}
            >
              <div className="size-48px">
                <div
                  className="flex items-center justify-center rounded-full w-full h-full"
                  style={{ background: COLORS[Math.floor(Math.random() * COLORS.length)], width: 48, height: 48 }}
                >
                  {city.icon_url ? (
                    <img src={city.icon_url} alt={city.name} width={42} height={42} />
                  ) : (
                    <i className="icon-location-outline size-[24px]" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                <p className="md:text-lg">{city.name}</p>
                <p className="md:text-base text-tertiary">{formatEventCount(city.listed_events_count || 0)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
