'use client';
import React from 'react';
import { Avatar, Button, InputField, Menu, Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { GetSpaceMembersDocument, Space, User } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';
import { debounce } from 'lodash';
import { format, formatDistance, formatDuration, isBefore, isToday, subDays } from 'date-fns';

interface Props {
  space: Space;
}

const LIMIT = 15;
const controller = new AbortController();
export function CommunityPeople({ space }: Props) {
  const [skip, setSkip] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const [search, setSearch] = React.useState('');

  const { data, loading } = useQuery(GetSpaceMembersDocument, {
    variables: { space: space._id, limit: LIMIT, skip, search },
    skip: !space._id,
  });

  const total = data?.listSpaceMembers?.total || 0;

  React.useEffect(() => {
    const handler = debounce(() => {
      setSearch(query);
    }, 500);

    handler();

    return () => {
      handler.cancel();
    };
  }, [query]);

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

      <InputField
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        value={query}
        iconLeft="icon-search"
        placeholder="Search"
      />

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

        <CardTable.EmptyState icon="icon-user-group-outline-2" title="No Data Found" />

        {data?.listSpaceMembers?.items?.map((item) => (
          <CardTable.Row key={item._id}>
            <div className="flex px-4 py-3 items-center">
              <div className="flex-1 flex gap-3 items-center">
                <Avatar src={userAvatar(item.user_expanded as unknown as User)} />
                <div className="flex flex-col md:flex-row md:gap-3">
                  <p>{item.user_name || item.user_expanded?.display_name || item.user_expanded?.name || 'Anonymous'}</p>
                  <p className="text-tertiary line-clamp-1">{item.email || item.user_expanded?.email}</p>
                </div>
              </div>
              <p className="text-tertiary text-sm">
                {isToday(item.role_changed_at)
                  ? formatDistance(item.role_changed_at, new Date(), { addSuffix: true })
                  : format(item.role_changed_at, 'MMM dd, yyyy')}
              </p>
            </div>
          </CardTable.Row>
        ))}

        {total > LIMIT && (
          <CardTable.Pagination
            skip={skip}
            limit={LIMIT}
            total={total}
            onPrev={() => setSkip((prev) => prev - LIMIT)}
            onNext={() => setSkip((prev) => prev + LIMIT)}
          />
        )}
      </CardTable.Root>
    </div>
  );
}
