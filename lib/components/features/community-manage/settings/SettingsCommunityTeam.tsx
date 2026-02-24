'use client';
import { Avatar, Button, Card, Divider, modal, Skeleton, toast } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import {
  DeleteSpaceMembersDocument,
  GetSpaceMembersDocument,
  Space,
  SpaceMember,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import React from 'react';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { AddTeam } from '../modals/AddTeam';
import { values } from 'lodash';

export function SettingsCommunityTeam({ space }: { space: Space }) {
  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <AdminSection space={space} />
      <Divider />
      <AmbassadorSection space={space} />
    </div>
  );
}

export function AdminSection({ space }: { space: Space }) {
  const me = useMe();
  const [mounted, setMounted] = React.useState(false);

  const { data, loading, refetch } = useQuery(GetSpaceMembersDocument, {
    variables: {
      space: space?._id,
      limit: 100,
      skip: 0,
      deletion: false,
      roles: [SpaceRole.Admin, SpaceRole.Creator],
    },
    skip: !space?._id,
    onComplete: () => {
      if (!mounted) setMounted(true);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold flex-1">Admins</h3>
          <Button
            iconLeft="icon-plus"
            size="sm"
            variant="tertiary-alt"
            onClick={() =>
              modal.open(AddTeam, {
                props: {
                  spaceId: space._id,
                  icon: 'icon-user',
                  title: 'Add Admins',
                  subtitle:
                    'Add admins by entering their email addresses. They don’t need to have an existing Lemonade account.',
                  btnText: 'Add Admins',
                  role: SpaceRole.Admin,
                  onCompleted: refetch,
                },
              })
            }
          >
            Add Admin
          </Button>
        </div>
        <p className="text-secondary">Admins have full access to the community and can approve events.</p>
      </div>

      <CardTable.Root loading={!mounted && loading}>
        <CardTable.Loading rows={5}>
          <Skeleton className="size-8 aspect-square rounded-full" animate />
          <Skeleton className="h-5 w-32" animate />

          <Skeleton className="h-5 w-10" animate />

          <div className="w-[62px] px-[60px] hidden md:block">
            <Skeleton className="h-5 w-16 rounded-full" animate />
          </div>
        </CardTable.Loading>

        <CardTable.EmptyState>
          <div className="p-4 flex gap-3 items-center">
            <i className="icon-user-group-outline size-9 aspect-square text-quaternary" />
            <div className="text-tertiary space-y-0.5">
              <p>No Admins</p>
              <p className="text-sm">Add people who can manage community.</p>
            </div>
          </div>
        </CardTable.EmptyState>

        {data?.listSpaceMembers.items?.map((item) => (
          <CardTable.Row key={item._id}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <Avatar src={userAvatar(item.user_expanded as unknown as User)} />
                <div className="flex items-center gap-1">
                  <p>{item.user_name || item.user_expanded?.name || 'Anonymous'}</p>
                  <p className="text-tertiary">{item.email || item.user_expanded?.email}</p>
                </div>
              </div>
              <i
                className="icon-user-remove cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                onClick={() => {
                  let title = 'Remove Admin';
                  let subtitle = 'Are you sure you want to remove this admin? They will lose access to it.';
                  let buttonText = undefined;
                  if (me?._id === item.user_expanded?._id) {
                    title = 'Leave Community Hub';
                    subtitle = 'Are you sure you want to leave this calendar? You will lose access to it.';
                    buttonText = 'Leave';
                  }

                  modal.open(ConfirmModal, {
                    props: {
                      icon: 'icon-user-remove',
                      title,
                      subtitle,
                      buttonText,
                      onConfirm: () => handleRemove(item._id),
                    },
                  });
                }}
              />
            </div>
          </CardTable.Row>
        ))}
      </CardTable.Root>
    </div>
  );
}

export function AmbassadorSection({ space }: { space: Space }) {
  const [mounted, setMounted] = React.useState(false);
  const [list, setList] = React.useState<SpaceMember[]>([]);

  const { data, loading, refetch } = useQuery(GetSpaceMembersDocument, {
    variables: {
      space: space?._id,
      limit: 100,
      skip: 0,
      deletion: false,
      roles: [SpaceRole.Ambassador],
    },
    skip: !space?._id,
    onComplete: () => {
      if (!mounted) setMounted(true);
    },
  });

  const [removeMember] = useMutation(DeleteSpaceMembersDocument);

  const handleRemove = async (id: string) => {
    const { error } = await removeMember({ variables: { input: { space: space._id, ids: [id] } } });
    if (error) {
      toast.error(error.message);
      return;
    }
    await refetch();
    setList((prev) => prev.filter((i) => i._id !== id));
  };

  React.useEffect(() => {
    if (data?.listSpaceMembers) {
      setList(data.listSpaceMembers.items as SpaceMember[]);
    }
  }, [data?.listSpaceMembers]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold flex-1">Ambassadors</h3>
          <Button
            iconLeft="icon-plus"
            size="sm"
            variant="tertiary-alt"
            onClick={() =>
              modal.open(AddTeam, {
                props: {
                  spaceId: space._id,
                  icon: 'icon-user',
                  title: 'Add Ambassadors',
                  subtitle:
                    'Add ambassadors by entering their email addresses. They don’t need to have an existing Lemonade account.',
                  btnText: 'Add Ambassadors',
                  role: SpaceRole.Ambassador,
                  onCompleted: refetch,
                },
              })
            }
          >
            Add Ambassador
          </Button>
        </div>
        <p className="text-secondary">
          Ambassadors can create events in this community without needing admin approval.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Card.Root onClick={() => {}}>
          <Card.Content className="flex gap-3 items-center">
            <div className="p-1.5 bg-card rounded-sm text-tertiary aspect-square size-7 flex items-center justify-center">
              <i className="icon-token size-4 aspect-square" />
            </div>
            <div className="flex-1">
              <p>Token Gating</p>
              <p className="text-sm text-tertiary">Let anyone holding your chosen tokens join as a brand ambassador.</p>
            </div>
            <i className="icon-chevron-right text-quaternary" />
          </Card.Content>
        </Card.Root>

        <CardTable.Root loading={!mounted && loading}>
          <CardTable.Loading rows={5}>
            <Skeleton className="size-8 aspect-square rounded-full" animate />
            <Skeleton className="h-5 w-32" animate />

            <Skeleton className="h-5 w-10" animate />

            <div className="w-[62px] px-[60px] hidden md:block">
              <Skeleton className="h-5 w-16 rounded-full" animate />
            </div>
          </CardTable.Loading>

          <CardTable.EmptyState>
            <div className="p-4 flex gap-3 items-center">
              <i aria-hidden="true" className="icon-user-group-outline size-9 aspect-square text-quaternary" />
              <div className="text-tertiary space-y-0.5">
                <p>No Ambassadors</p>
                <p className="text-sm">Add people who can create or list events without needing admin approval.</p>
              </div>
            </div>
          </CardTable.EmptyState>

          {list
            .filter((i) => [SpaceRole.Admin, SpaceRole.Creator].includes(i.role as SpaceRole))
            ?.map((item) => (
              <CardTable.Row key={item._id}>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <Avatar src={userAvatar(item.user_expanded)} />
                    <div className="flex items-center gap-1">
                      <p>{item.user_name || item.user_expanded?.name || 'Anonymous'}</p>
                      <p className="text-tertiary">{item.email || item.user_expanded?.email}</p>
                    </div>
                  </div>
                </div>
                <i
                  className="icon-user-remove cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                  onClick={() => {
                    modal.open(ConfirmModal, {
                      props: {
                        icon: 'icon-user-remove',
                        title: 'Remove Ambassador?',
                        subtitle: 'Are you sure you want to remove this ambassador? They will lose access to it.',
                        onConfirm: () => handleRemove(item._id),
                      },
                    });
                  }}
                />
              </CardTable.Row>
            ))}
        </CardTable.Root>
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex-1">Ambassadors</h3>
            <Button
              iconLeft="icon-plus"
              size="sm"
              variant="tertiary-alt"
              onClick={() =>
                modal.open(AddTeam, {
                  props: {
                    spaceId: space._id,
                    icon: 'icon-user',
                    title: 'Add Ambassadors',
                    subtitle:
                      'Add ambassadors by entering their email addresses. They don’t need to have an existing Lemonade account.',
                    btnText: 'Add Ambassadors',
                    role: SpaceRole.Ambassador,
                    onCompleted: refetch,
                  },
                })
              }
            >
              Add Ambassador
            </Button>
          </div>
          <p className="text-secondary">
            Ambassadors can create events in this community without needing admin approval.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <Card.Root onClick={() => {}}>
            <Card.Content className="flex gap-3 items-center">
              <div className="p-1.5 bg-card rounded-sm text-tertiary aspect-square size-7 flex items-center justify-center">
                <i aria-hidden="true" className="icon-token size-4 aspect-square" />
              </div>
              <div className="flex-1">
                <p>Token Gating</p>
                <p className="text-sm text-tertiary">
                  Let anyone holding your chosen tokens join as a brand ambassador.
                </p>
              </div>
              <i aria-hidden="true" className="icon-chevron-right text-quaternary" />
            </Card.Content>
          </Card.Root>

          <CardTable.Root loading={!mounted && loading}>
            <CardTable.Loading rows={5}>
              <Skeleton className="size-8 aspect-square rounded-full" animate />
              <Skeleton className="h-5 w-32" animate />

              <Skeleton className="h-5 w-10" animate />

              <div className="w-[62px] px-[60px] hidden md:block">
                <Skeleton className="h-5 w-16 rounded-full" animate />
              </div>
            </CardTable.Loading>

            <CardTable.EmptyState>
              <div className="p-4 flex gap-3 items-center">
                <i aria-hidden="true" className="icon-person-pin-rounded size-9 aspect-square text-quaternary" />
                <div className="text-tertiary space-y-0.5">
                  <p>No Ambassadors</p>
                  <p className="text-sm">Add people who can create or list events without needing admin approval.</p>
                </div>
              </div>
            </CardTable.EmptyState>

            {list
              .filter((i) => i.role === SpaceRole.Ambassador)
              ?.map((item) => (
                <CardTable.Row key={item._id}>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <Avatar src={userAvatar(item.user_expanded)} />
                      <div className="flex items-center gap-1">
                        <p>{item.user_name || item.user_expanded?.name || 'Anonymous'}</p>
                        <p className="text-tertiary">{item.email || item.user_expanded?.email}</p>
                      </div>
                    </div>
                    <i
                      className="icon-user-remove cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                      onClick={() => {
                        modal.open(ConfirmModal, {
                          props: {
                            icon: 'icon-user-remove',
                            title: 'Remove Ambassador?',
                            subtitle: 'Are you sure you want to remove this ambassador? They will lose access to it.',
                            onConfirm: () => handleRemove(item._id),
                          },
                        });
                      }}
                    />
                  </div>
                </CardTable.Row>
              ))}
          </CardTable.Root>
        </div>
      </div>
    </div>
  );
}
