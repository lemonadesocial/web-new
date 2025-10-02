'use client';
import { GetSpaceDocument, GetSpaceQuery, Space } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { CommunityEventsWithCalendar } from '../community/CommunityEventsWithCalendar';

export function CommunityEvents({ space: initSpace }: { space: Space }) {
  const { data } = useQuery(GetSpaceDocument, {
    variables: { id: initSpace?._id },
    skip: initSpace._id,
    initData: initSpace ? ({ getSpace: initSpace } as unknown as GetSpaceQuery) : undefined,
  });
  const space = data?.getSpace as Space;

  return (
    <>
      <CommunityEventsWithCalendar space={space} />
    </>
  );
}
