'use client';
import { Avatar, Button, Card, Divider, toast } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { GetSpaceTagsDocument, Space, SpaceTag, SpaceTagType } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';

export function SettingsCommunityTags({ space }: { space: Space }) {
  const { data } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
  });
  const spaceTags = (data?.listSpaceTags as SpaceTag[]) || [];
  const eventTags = spaceTags.filter((i) => i.type === SpaceTagType.Event);
  const memberTags = spaceTags.filter((i) => i.type === SpaceTagType.Member);

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex-1">Event Tags</h3>
            <Button iconLeft="icon-plus" size="sm" variant="tertiary-alt">
              Create Tag
            </Button>
          </div>
          <p className="text-secondary">Allow visitors to filter events by categories on the community page.</p>
        </div>

        <CardTable.Root>
          {eventTags?.map((item) => (
            <CardTable.Row key={item._id}>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <i className="icon-dot size-5 aspect-square" style={{ color: item.color }} />
                  <div className="flex items-center gap-1">
                    <p>{item.tag}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <p className="text-sm text-tertiary">{item.targets?.length} Events</p>
                  <i
                    className="icon-more-horiz cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                    onClick={() => toast.success('Comming soon')}
                  />
                </div>
              </div>
            </CardTable.Row>
          ))}
        </CardTable.Root>
      </div>

      <Divider />

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex-1">Member Tags</h3>
            <Button iconLeft="icon-plus" size="sm" variant="tertiary-alt">
              Create Tag
            </Button>
          </div>
          <p className="text-secondary">
            Organize your audience with member tags. These tags are only visible to admins.
          </p>
        </div>

        <CardTable.Root>
          {memberTags?.map((item) => (
            <CardTable.Row>
              <div key={item._id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <i className="icon-dot size-5 aspect-square" style={{ color: item.color }} />
                  <div className="flex items-center gap-1">
                    <p>{item.tag}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <p className="text-sm text-tertiary">{item.targets?.length} Events</p>
                  <i
                    className="icon-more-horiz cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                    onClick={() => toast.success('Comming soon')}
                  />
                </div>
              </div>
            </CardTable.Row>
          ))}
        </CardTable.Root>
      </div>
    </div>
  );
}
