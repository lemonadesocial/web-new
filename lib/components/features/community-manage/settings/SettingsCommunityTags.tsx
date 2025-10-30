'use client';
import React from 'react';
import { Button, Divider, Menu, MenuItem, modal, Skeleton, toast } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import {
  DeleteSpaceTagDocument,
  GetSpaceTagsDocument,
  Space,
  SpaceTag,
  SpaceTagType,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import AddTagModal from '../modals/AddTagModal';

export function SettingsCommunityTags({ space }: { space: Space }) {
  const [mounted, setMounted] = React.useState(false);

  const { data, loading, refetch } = useQuery(GetSpaceTagsDocument, {
    variables: { space: space?._id },
    skip: !space?._id,
    onComplete: () => {
      if (!mounted) setMounted(true);
    },
  });
  const spaceTags = (data?.listSpaceTags as SpaceTag[]) || [];
  const eventTags = spaceTags.filter((i) => i.type === SpaceTagType.Event);
  const memberTags = spaceTags.filter((i) => i.type === SpaceTagType.Member);

  const [deleteTag] = useMutation(DeleteSpaceTagDocument);

  const handleDelete = async (tagId: string) => {
    await deleteTag({ variables: { id: tagId, space: space._id } });
    await refetch();
    toast.success('Remove tag success.');
  };

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex-1">Event Tags</h3>
            <Button
              iconLeft="icon-plus"
              size="sm"
              variant="tertiary-alt"
              onClick={() =>
                modal.open(AddTagModal, {
                  props: {
                    title: 'Create Event Tag',
                    subtitle: 'Event tags let community visitors filter events by category.',
                    type: SpaceTagType.Event,
                    spaceId: space._id,
                  },
                })
              }
            >
              Create Tag
            </Button>
          </div>
          <p className="text-secondary">Allow visitors to filter events by categories on the community page.</p>
        </div>

        <CardTable.Root loading={!mounted && loading} className="overflow-visible">
          <CardTable.Loading rows={7}>
            <Skeleton className="size-8 aspect-square rounded-full" animate />
            <Skeleton className="h-5 w-32" animate />

            <Skeleton className="h-5 w-10" animate />

            <div className="w-[62px] px-[60px] hidden md:block">
              <Skeleton className="h-5 w-16 rounded-full" animate />
            </div>
          </CardTable.Loading>

          <CardTable.EmptyState>
            <div className="p-4 flex gap-3 items-center">
              <i className="icon-price-tag-filled size-9 aspect-square text-quaternary" />
              <div className="text-tertiary space-y-0.5">
                <p>No Tags</p>
                <p className="text-sm">Create event tags to let visitors filter events by category.</p>
              </div>
            </div>
          </CardTable.EmptyState>

          {eventTags?.map((item, idx) => (
            <CardTable.Row key={item._id}>
              <div className="px-4 py-3 flex items-center justify-between" onClick={() => {}}>
                <div className="flex gap-3 items-center">
                  <i className="icon-dot size-5 aspect-square" style={{ color: item.color }} />
                  <div className="flex items-center gap-1">
                    <p>{item.tag}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <p className="text-sm text-tertiary">{item.targets?.length} Events</p>
                  <Menu.Root placement={idx > eventTags.length - 3 ? 'top-end' : 'bottom-end'}>
                    <Menu.Trigger>
                      {({ toggle }) => (
                        <i
                          className="icon-more-horiz cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                          onClick={() => toggle()}
                        />
                      )}
                    </Menu.Trigger>
                    <Menu.Content className="p-1">
                      <MenuItem
                        title="Edit Tag"
                        iconLeft="icon-edit-sharp"
                        onClick={() => {
                          modal.open(AddTagModal, {
                            props: {
                              title: 'Update Event Tag',
                              subtitle: 'Event tags let community visitors filter events by category.',
                              type: SpaceTagType.Event,
                              spaceId: space._id,
                              value: { tag: item.tag, color: item.color, id: item._id },
                            },
                          });
                        }}
                      />
                      <MenuItem title="Delete Tag" iconLeft="icon-delete" onClick={() => handleDelete(item._id)} />
                    </Menu.Content>
                  </Menu.Root>
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
            <Button
              iconLeft="icon-plus"
              size="sm"
              variant="tertiary-alt"
              onClick={() =>
                modal.open(AddTagModal, {
                  props: {
                    title: 'Create Member Tag',
                    subtitle: 'Member tags are only visible to community admins.',
                    type: SpaceTagType.Member,
                    spaceId: space._id,
                  },
                })
              }
            >
              Create Tag
            </Button>
          </div>
          <p className="text-secondary">
            Organize your audience with member tags. These tags are only visible to admins.
          </p>
        </div>

        <CardTable.Root loading={!mounted && loading} className="overflow-visible">
          <CardTable.Loading rows={7}>
            <Skeleton className="size-8 aspect-square rounded-full" animate />
            <Skeleton className="h-5 w-32" animate />

            <Skeleton className="h-5 w-10" animate />

            <div className="w-[62px] px-[60px] hidden md:block">
              <Skeleton className="h-5 w-16 rounded-full" animate />
            </div>
          </CardTable.Loading>

          <CardTable.EmptyState>
            <div className="p-4 flex gap-3 items-center">
              <i className="icon-price-tag-filled size-9 aspect-square text-quaternary" />
              <div className="text-tertiary space-y-0.5">
                <p>No Tags</p>
                <p className="text-sm">Tag members to better organize and communicate with them.</p>
              </div>
            </div>
          </CardTable.EmptyState>

          {memberTags?.map((item, idx) => (
            <CardTable.Row key={item._id}>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <i className="icon-dot size-5 aspect-square" style={{ color: item.color }} />
                  <div className="flex items-center gap-1">
                    <p>{item.tag}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <p className="text-sm text-tertiary">{item.targets?.length} Events</p>
                  <Menu.Root placement={idx > memberTags.length - 3 ? 'top-end' : 'bottom-end'}>
                    <Menu.Trigger>
                      {({ toggle }) => (
                        <i
                          className="icon-more-horiz cursor-pointer size-5 aspect-square text-tertiary hover:text-primary"
                          onClick={() => toggle()}
                        />
                      )}
                    </Menu.Trigger>
                    <Menu.Content className="p-1">
                      <MenuItem
                        title="Edit Tag"
                        iconLeft="icon-edit-sharp"
                        onClick={() => {
                          modal.open(AddTagModal, {
                            props: {
                              title: 'Update Member Tag',
                              subtitle: 'Member tags are only visible to community admins.',
                              type: SpaceTagType.Member,
                              spaceId: space._id,
                              value: { tag: item.tag, color: item.color, id: item._id },
                            },
                          });
                        }}
                      />
                      <MenuItem title="Delete Tag" iconLeft="icon-delete" onClick={() => handleDelete(item._id)} />
                    </Menu.Content>
                  </Menu.Root>
                </div>
              </div>
            </CardTable.Row>
          ))}
        </CardTable.Root>
      </div>
    </div>
  );
}
