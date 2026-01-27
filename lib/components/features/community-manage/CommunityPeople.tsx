'use client';
import React from 'react';
import { Avatar, Button, Divider, drawer, InputField, Menu, MenuItem, modal, Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import {
  GetSpaceMembersDocument,
  GetSpaceTagsDocument,
  ManageSpaceTagDocument,
  Space,
  SpaceMember,
  SpaceTag,
  SpaceTagType,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';
import { debounce, snakeCase } from 'lodash';
import { format, formatDistance, isToday } from 'date-fns';
import clsx from 'clsx';
import { downloadCSVFile } from '$lib/utils/file';
import { AddCommunityPeople } from './modals/AddCommunityPeople';
import { Pane } from '$lib/components/core/pane/pane';
import { AddTags } from '../community/ListingEvent';

interface Props {
  space: Space;
}

const LIMIT = 15;

const SORT_BY_ITEMS: Record<string, { label: string }> = {
  user_name: { label: 'Name' },
  role_changed_at: { label: 'Recently Joined' },
  //revenue: { label: 'Revenue' },
  //events_registered: { label: 'Events Registered' },
  //events_checked_in: { label: 'Events Checked In' },
};

const FILTER_BY_LAST_ITEMS: Record<string, { label: string; icon: string }> = {
  unsubscribed: { label: 'Unsubscribed', icon: 'icon-person-cancel' },
  deletion: { label: 'Removed', icon: 'icon-person-remove' },
  //blocked: { label: 'Blocked' },
};

type FilterTagType = {
  [key: string]: {
    label: string;
    count?: number;
    icon: {
      name: string;
      color: string;
    };
  };
};

export function CommunityPeople({ space }: Props) {
  const [skip, setSkip] = React.useState(0);
  const [query, setQuery] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState('role_changed_at');
  const [filterBy, setFilterBy] = React.useState('all');
  const [filterByTags, setFilterByTags] = React.useState<string[]>([]);

  const { data, loading, refetch } = useQuery(GetSpaceMembersDocument, {
    variables: {
      space: space._id,
      limit: LIMIT,
      skip,
      search,
      tags: filterByTags,
      sort: {
        field: sortBy,
        order: -1,
      },
    },
    skip: !space._id,
  });

  const total = data?.listSpaceMembers?.total || 0;

  const { data: dataGetSpaceTags } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space._id },
    skip: !space._id,
  });
  const listSpaceTags = (dataGetSpaceTags?.listSpaceTags || []) as SpaceTag[];
  const memberTags = listSpaceTags.filter((t) => t.type === SpaceTagType.Member) || [];
  const tags = memberTags.reduce((acc: FilterTagType, { _id, tag, targets, color }) => {
    acc[_id] = { label: tag, count: targets?.length, icon: { name: 'icon-dot', color } };
    return acc;
  }, {});

  const handleExport = async () => {
    const url = `/space/${space._id}/export/members?role=subscriber`;
    await downloadCSVFile(url, snakeCase(`${space.title}_people`));
  };

  const onAddPeople = () => {
    modal.open(AddCommunityPeople, { props: { spaceId: space._id, onCompleted: refetch } });
  };

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
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <h3 className="flex-1 text-xl font-semibold">
            People {!!data?.listSpaceMembers.total && `(${data?.listSpaceMembers.total})`}
          </h3>
          <Button variant="tertiary-alt" size="sm" iconLeft="icon-user-plus" onClick={() => onAddPeople()}>
            Add People
          </Button>
          <Button variant="tertiary-alt" size="sm" iconLeft="icon-download" onClick={handleExport} />
          <Menu.Root>
            <Menu.Trigger>
              <Button variant="tertiary-alt" size="sm" iconLeft="icon-more-vert" />
            </Menu.Trigger>
            <Menu.Content className="p-1">
              {({ toggle }) => (
                <>
                  {Object.entries(FILTER_BY_LAST_ITEMS).map(([key, value]) => (
                    <MenuItem key={key} title={value.label} iconLeft={value.icon} />
                  ))}
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        <InputField
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          iconLeft="icon-search"
          placeholder="Search"
        />

        <div className="flex items-center justify-between">
          <Menu.Root placement="bottom-start">
            <Menu.Trigger>
              <Button iconLeft="icon-filter-line" iconRight="icon-chevron-down" size="sm" variant="tertiary-alt">
                Filter
              </Button>
            </Menu.Trigger>
            <Menu.Content className="p-0 h-64 w-48 overflow-y-auto">
              {({ toggle }) => (
                <>
                  <div className="p-1">
                    <MenuItem
                      title="all"
                      iconLeft="icon-ticket"
                      iconRight={filterBy === 'all' ? 'icon-done' : ''}
                      onClick={() => {
                        setFilterBy('all');
                        setFilterByTags([]);
                        toggle();
                      }}
                    />
                  </div>
                  <Divider />
                  <div className="p-1">
                    <p className="text-xs text-tertiary px-2">Tags</p>
                    {Object.entries(tags).map(([key, value]) => (
                      <MenuItem
                        key={key}
                        iconLeft={
                          <i
                            className={`text-tertiary size-4 ${value.icon.name}`}
                            style={{ color: value.icon.color }}
                          />
                        }
                        iconRight={filterByTags.includes(key) ? 'icon-done' : ''}
                        onClick={() => {
                          const updatedFilterByTags = filterByTags.includes(key)
                            ? filterByTags.filter((tag) => tag !== key)
                            : [...filterByTags, key];
                          setFilterByTags(updatedFilterByTags);
                          setFilterBy('');
                        }}
                      >
                        <p className="font-medium text-sm font-default-body text-secondary flex-1 line-clamp-2 max-w-xs text-wrap">
                          {value.label}
                        </p>
                      </MenuItem>
                    ))}
                  </div>
                </>
              )}
            </Menu.Content>
          </Menu.Root>

          <Menu.Root>
            <Menu.Trigger>
              <Button iconLeft="icon-sort" iconRight="icon-chevron-down" size="sm" variant="tertiary-alt">
                {SORT_BY_ITEMS[sortBy].label}
              </Button>
            </Menu.Trigger>
            <Menu.Content className="p-1">
              {({ toggle }) => (
                <>
                  {Object.entries(SORT_BY_ITEMS).map(([key, value]) => (
                    <MenuItem
                      key={key}
                      title={value.label}
                      iconLeft={clsx('icon-done', key === sortBy ? 'opacity-100' : 'opacity-0')}
                      onClick={() => {
                        setSortBy(key);
                        toggle();
                      }}
                    />
                  ))}
                </>
              )}
            </Menu.Content>
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

          <CardTable.EmptyState>
            <div className="flex flex-col gap-5 pt-12 pb-20 items-center justify-center text-tertiary">
              <i className="icon-user-group-rounded size-44 md:size-[184px] text-quaternary" />
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">No Subscribers</h3>
                <p>When people subscribe to your calendar, they will appear here.</p>
              </div>
              <Button iconLeft="icon-plus" variant="tertiary-alt" size="sm" onClick={() => onAddPeople()}>
                Add People
              </Button>
            </div>
          </CardTable.EmptyState>

          {data?.listSpaceMembers?.items?.map((item) => (
            <CardTable.Row key={item._id}>
              <div
                className="flex px-4 py-3 items-center gap-3"
                onClick={() =>
                  drawer.open(PeopleDetailPane, {
                    props: { member: item as SpaceMember, spaceId: space._id, onRefetch: refetch },
                  })
                }
              >
                <div className="flex-1 flex gap-3 items-center">
                  <Avatar
                    className="size-7 md:size-5 aspect-square"
                    src={userAvatar(item.user_expanded as unknown as User)}
                  />
                  <div className="flex flex-col md:flex-row md:gap-3 md:items-center flex-1">
                    <p>
                      {item.user_name || item.user_expanded?.display_name || item.user_expanded?.name || 'Anonymous'}
                    </p>
                    <div className="items-center hidden md:flex">
                      {item.tags?.map((t) => (
                        <div
                          key={t._id}
                          className="border-1 first:ml-0 border-overlay-primary -ml-0.5 size-2 rounded-full"
                          style={{ background: t.color }}
                        />
                      ))}
                    </div>
                    <p className="text-tertiary line-clamp-1">{item.email || item.user_expanded?.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="text-tertiary text-sm">
                    {isToday(item.role_changed_at)
                      ? formatDistance(item.role_changed_at, new Date(), { addSuffix: true })
                      : format(item.role_changed_at, 'MMM dd, yyyy')}
                  </p>
                  <div className="items-center flex md:hidden">
                    {item.tags?.map((t) => (
                      <div
                        key={t._id}
                        className="border-1 first:ml-0 border-overlay-primary -ml-0.5 size-2 rounded-full"
                        style={{ background: t.color }}
                      />
                    ))}
                  </div>
                </div>
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
    </div>
  );
}

function PeopleDetailPane({
  member,
  spaceId,
  onRefetch,
}: {
  member: SpaceMember;
  spaceId: string;
  onRefetch: () => void;
}) {
  const [manageSpaceTag] = useMutation(ManageSpaceTagDocument, {
    onComplete: () => onRefetch?.(),
  });

  const handleManageSpaceTag = (tag: SpaceTag, tagged: boolean) => {
    manageSpaceTag({
      variables: { space: spaceId, target: member.user_expanded?._id || member.email, id: tag._id, tagged },
    });
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>
      <Pane.Content className="p-4 gap-5">
        <div className="flex gap-3 items-center">
          <Avatar size="xl" src={userAvatar(member.user_expanded as unknown as User)} />
          <div className="flex flex-col ">
            <p>{member.user_name || member.user_expanded?.display_name || member.user_expanded?.name || 'Anonymous'}</p>
            <p className="text-tertiary line-clamp-1">{member.email || member.user_expanded?.email}</p>
          </div>
        </div>

        <AddTags
          spaceId={spaceId}
          value={member.tags || []}
          type={SpaceTagType.Member}
          onRemove={(t) => handleManageSpaceTag(t, false)}
          onAdd={(t) => handleManageSpaceTag(t, true)}
        />
      </Pane.Content>
    </Pane.Root>
  );
}
