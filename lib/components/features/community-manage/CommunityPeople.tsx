'use client';
import React from 'react';
import { Avatar, Button, InputField, Menu, Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { GetSpaceMembersDocument, Space, User } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';

interface Props {
  space: Space;
}

const LIMIT = 15;
export function CommunityPeople({ space }: Props) {
  const [skip, setSkip] = React.useState(0);
  const { data, loading } = useQuery(GetSpaceMembersDocument, {
    variables: { space: space._id, limit: LIMIT, skip },
    skip: !space._id,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <h3 className="flex-1 text-xl font-semibold">
          People {!!data?.listSpaceMembers.total && `(${data?.listSpaceMembers.total})`}
        </h3>
        <Button variant="tertiary-alt" size="sm" iconLeft="icon-user-plus">
          Add People
        </Button>
        <Button variant="tertiary-alt" size="sm" iconLeft="icon-download" />
        <Button variant="tertiary-alt" size="sm" iconLeft="icon-more-vert" />
      </div>

      <InputField iconLeft="icon-search" placeholder="Search" />

      <div className="flex items-center justify-between">
        <Menu.Root>
          <Menu.Trigger>
            <Button iconLeft="icon-filter-line" iconRight="icon-chevron-down" size="sm" variant="tertiary-alt">
              Filter
            </Button>
          </Menu.Trigger>
          <Menu.Content>content</Menu.Content>
        </Menu.Root>

        <Menu.Root>
          <Menu.Trigger>
            <Button iconLeft="icon-sort" iconRight="icon-chevron-down" size="sm" variant="tertiary-alt">
              Recently Joined
            </Button>
          </Menu.Trigger>
          <Menu.Content>content</Menu.Content>
        </Menu.Root>
      </div>

      <CardTable.Root loading={loading}>
        <CardTable.Loading rows={3}>
          <Skeleton className="size-8 aspect-square rounded-full" animate />
          <Skeleton className="h-5 w-32" animate />

          <Skeleton className="h-5 w-10" animate />

          <div className="w-[62px] px-[60px] hidden md:block">
            <Skeleton className="h-5 w-16 rounded-full" animate />
          </div>
        </CardTable.Loading>

        <CardTable.EmptyState icon="icon-community" title="No Featured Hub" />

        {data?.listSpaceMembers?.items?.map((item) => (
          <CardTable.Row key={item._id}>
            <div className="flex-1 px-4 py-3 flex gap-3">
              <Avatar src={userAvatar(item.user_expanded as unknown as User)} />
              <p>{item.user_expanded?.display_name || item.user_expanded?.name || 'Anonymous'}</p>
              <p className="text-tertiary">{item.email || item.user_expanded?.email}</p>
            </div>
          </CardTable.Row>
        ))}

        <CardTable.Pagination
          skip={skip}
          limit={LIMIT}
          total={data?.listSpaceMembers.total || 0}
          onPrev={() => setSkip((prev) => prev - LIMIT)}
          onNext={() => setSkip((prev) => prev + LIMIT)}
        />
      </CardTable.Root>
    </div>
  );
}
