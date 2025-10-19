'use client';
import { Avatar, Button, Card, Divider, toast } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { GetSpaceMembersDocument, Space, SpaceRole, User } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';

export function SettingsCommunityTeam({ space }: { space: Space }) {
  const { data } = useQuery(GetSpaceMembersDocument, {
    variables: { space: space?._id, limit: 100, skip: 0 },
    skip: !space?._id,
  });
  const admins = data?.listSpaceMembers.items.filter((i) => i.role === SpaceRole.Admin);
  const ambassadors = data?.listSpaceMembers.items.filter((i) => i.role === SpaceRole.Ambassador);

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

        <CardTable.Root>
          {admins?.map((item) => (
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
                  onClick={() => toast.success('Comming soon')}
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

          <CardTable.Root>
            {ambassadors?.map((item) => (
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
                    onClick={() => toast.success('Comming soon')}
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
