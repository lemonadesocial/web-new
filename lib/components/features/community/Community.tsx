'use client';
import React from 'react';
import Link from 'next/link';

import { Button, Divider } from '$lib/components/core';
import { HeroSection } from '$lib/components/features/community';
import {
  GetSpaceDocument,
  GetSpaceQuery,
  GetSubSpacesDocument,
  PublicSpace,
  Space,
  SpaceTag,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { PASSPORT_PROVIDERS, type PASSPORT_PROVIDER } from '$lib/components/features/passports/types';

import CommunityCard from './CommunityCard';
import { WidgetContainer } from './widgets/WidgetContainer';
import { CommunityEventsWithCalendar } from './CommunityEventsWithCalendar';

type Props = {
  initData: {
    space?: Space;
    subSpaces?: PublicSpace[];
    spaceTags?: SpaceTag[];
  };
  customTitle?: (title: string) => React.ReactElement;
  hideHeroSection?: boolean;
  locked?: React.ReactElement;
  showEvents?: boolean;
};

export function Community({ initData, hideHeroSection = false, showEvents }: Props) {
  const hideSubspace = true;

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: initData.space?._id },
    fetchPolicy: 'cache-and-network',
    initData: { getSpace: initData.space } as GetSpaceQuery,
  });
  const space = dataGetSpace?.getSpace as Space;

  const { data: dataGetSubSpaces } = useQuery(GetSubSpacesDocument, {
    variables: { id: space?._id },
    skip: !space?._id || !space?.sub_spaces?.length,
    fetchPolicy: 'cache-and-network',
  });

  const subSpaces = (dataGetSubSpaces?.getSubSpaces || []) as PublicSpace[];

  return (
    <div className="relative pb-20">
      {!hideHeroSection && (
        <>
          <HeroSection space={dataGetSpace?.getSpace as Space} />
          <Divider className="my-8" />
          {!hideSubspace && subSpaces.length > 0 && (
            <>
              <section className="flex flex-col gap-6">
                <div className="w-full flex justify-between items-center">
                  <h1 className="text-xl md:text-2xl font-semibold flex-1 text-primary">Hubs</h1>
                  {subSpaces.length > 3 && (
                    <Link href={`/s/${space?.slug || space?._id}/featured-hubs`}>
                      <Button variant="tertiary-alt" size="sm">
                        {`View All (${subSpaces.length})`}
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subSpaces.slice(0, 3).map((space) => (
                    <CommunityCard key={space._id} space={space} />
                  ))}
                </div>
              </section>
              <Divider className="my-8" />
            </>
          )}
        </>
      )}

      {space.theme_name && PASSPORT_PROVIDERS.includes(space.theme_name as PASSPORT_PROVIDER) && !showEvents ? (
        <WidgetContainer space={space} />
      ) : (
        <CommunityEventsWithCalendar space={space} />
      )}
    </div>
  );
}
