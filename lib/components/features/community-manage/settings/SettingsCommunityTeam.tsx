'use client';
import { Avatar, Button, Card, Divider, modal, Skeleton } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import {
  DeleteSpaceMembersDocument,
  GetSpaceMembersDocument,
  Space,
  SpaceMember,
  SpaceRole,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import React from 'react';
import { ConfirmModal } from '../../modals/ConfirmModal';

export function SettingsCommunityTeam({ space }: { space: Space }) {
  const me = useMe();
  const [list, setList] = React.useState<SpaceMember[]>([]);

  const { data, loading } = useQuery(GetSpaceMembersDocument, {
    variables: { space: space?._id, limit: 100, skip: 0 },
    skip: !space?._id,
  });

  const [removeMember] = useMutation(DeleteSpaceMembersDocument);

  const handleRemove = async (id: string) => {
    await removeMember({ variables: { input: { space: space._id, ids: [id] } } });
    setList((prev) => prev.filter((i) => i._id !== id));
  };

  React.useEffect(() => {
    if (data?.listSpaceMembers) {
      setList(data.listSpaceMembers.items as SpaceMember[]);
    }
  }, [data?.listSpaceMembers]);

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex-1">Admins</h3>
            <Button iconLeft="icon-plus" size="sm" variant="tertiary-alt">
              Add Admin
            </Button>
          </div>
          <p className="text-secondary">Admins have full access to the community and can approve events.</p>
        </div>

        <CardTable.Root loading={loading}>
          <CardTable.Loading rows={5}>
            <Skeleton className="size-8 aspect-square rounded-full" animate />
            <Skeleton className="h-5 w-32" animate />

            <Skeleton className="h-5 w-10" animate />

            <div className="w-[62px] px-[60px] hidden md:block">
              <Skeleton className="h-5 w-16 rounded-full" animate />
            </div>
          </CardTable.Loading>

          <CardTable.EmptyState icon="icon-tag" title="No Data Found" />

          {list
            .filter((i) => [SpaceRole.Admin, SpaceRole.Creator].includes(i.role as SpaceRole))
            ?.map((item) => (
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

      <Divider />

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

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold flex-1">Ambassadors</h3>
              <Button iconLeft="icon-plus" size="sm" variant="tertiary-alt">
                Add Ambassador
              </Button>
            </div>
            <p className="text-secondary">
              Ambassadors can create events in this community without needing admin approval.
            </p>
          </div>

          <CardTable.Root loading={loading}>
            <CardTable.Loading rows={5}>
              <Skeleton className="size-8 aspect-square rounded-full" animate />
              <Skeleton className="h-5 w-32" animate />

              <Skeleton className="h-5 w-10" animate />

              <div className="w-[62px] px-[60px] hidden md:block">
                <Skeleton className="h-5 w-16 rounded-full" animate />
              </div>
            </CardTable.Loading>

            <CardTable.EmptyState icon="icon-tag" title="No Data Found" />

            {list
              .filter((i) => i.role === SpaceRole.Ambassador)
              ?.map((item) => (
                <CardTable.Row>
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
                        modal.open(ConfirmModal, {
                          props: {
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
