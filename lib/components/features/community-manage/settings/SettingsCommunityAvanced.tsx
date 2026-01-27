'use client';
import { Button, Card, Divider, drawer, FileInput, Input, Menu, MenuItem, modal, toast, Toggle } from '$lib/components/core';
import {
  DeleteSpaceDocument,
  GetSpaceDocument,
  GetSpaceQuery,
  Space,
  UpdateSpaceDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import React from 'react';
import { TitleDescModal } from '../modals/TitleDescModal';
import { ConfirmModal } from '../../modals/ConfirmModal';
import { ChangeStatusModal } from '../modals/ChangeStatusModal';
import { CustomDomainPane } from '../panes/CustomDomainPane';
import { uploadFiles } from '$lib/utils/file';

export function SettingsCommunityAvanced(props: { space: Space }) {
  const { data } = useQuery(GetSpaceDocument, {
    variables: { id: props.space?._id },
    initData: { __typename: 'Query', getSpace: props.space } as GetSpaceQuery,
    skip: !props.space?._id,
  });
  const space = data?.getSpace as Space;

  const [update] = useMutation(UpdateSpaceDocument, {
    onComplete: (client, incoming) => {
      toast.success('Update success.');
      if (space) client.writeFragment({ id: `Space:${space._id}`, data: { ...space, ...incoming.updateSpace } });
    },
  });

  const [deleteSpace] = useMutation(DeleteSpaceDocument, {
    onComplete(_client, response) {
      if (response.deleteSpace) {
        window.location.href = '/communities';
      }
    },
  });

  const handleUpdate = async (input: Partial<Space>) => {
    await update({ variables: { id: space._id, input } });
  };

  const [uploadingFavicon, setUploadingFavicon] = React.useState(false);

  const handleFaviconUpload = async (files: File[]) => {
    if (!files.length || !space) return;

    try {
      setUploadingFavicon(true);
      const uploadedFiles = await uploadFiles(files, 'community');
      if (uploadedFiles[0]?.url) {
        await handleUpdate({ fav_icon_url: uploadedFiles[0].url });
      }
    } catch (err) {
      console.error(err);
      toast.error('Cannot upload favicon!');
    } finally {
      setUploadingFavicon(false);
    }
  };

  const hostNames = space?.hostnames?.filter((hostname) => !hostname.endsWith('lemonade.social'));

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Event Defaults</h3>
          <p className="text-secondary">Default settings for new events created on this community.</p>
        </div>

        <Card.Root>
          <Card.Content className="p-0 divide-y divide-(--color-divider)">
            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p>Event Visibility</p>
                <p className="text-sm text-tertiary">Whether events are shown on the community page.</p>
              </div>
              <Menu.Root>
                <Menu.Trigger>
                  {({ toggle }) => (
                    <Button size="sm" variant="tertiary-alt" onClick={toggle} iconRight="icon-chevron-down">
                      {!space?.private ? 'Public' : 'Private'}
                    </Button>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-1">
                  {({ toggle }) => (
                    <>
                      <MenuItem
                        title="Public"
                        onClick={() => {
                          handleUpdate({ private: false });
                          toggle();
                        }}
                      />
                      <MenuItem
                        title="Private"
                        onClick={() => {
                          handleUpdate({ private: true });
                          toggle();
                        }}
                      />
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>
            </div>

            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p>Public Guest List</p>
                <p className="text-sm text-tertiary">Whether to show guest list on event pages.</p>
              </div>
              <Toggle
                id="public-guest"
                onChange={() => {
                  toast.success('Coming soon.');
                }}
              />
            </div>

            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p>Collect Feedback</p>
                <p className="text-sm text-tertiary">Email guests after the event to collect feedback.</p>
              </div>
              <Toggle
                id="public-guest"
                onChange={() => {
                  toast.success('Coming soon.');
                }}
              />
            </div>
          </Card.Content>
        </Card.Root>

        <p className="text-secondary text-sm">
          Changing these defaults does not affect existing events. You can always change these settings for each
          individual event.
        </p>
      </div>

      <Divider />

      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Custom Domain</h3>
          <p className="text-secondary">
            Turn your community into a fully customizable website. Get a free Lemonade domain or connect your own.
          </p>
        </div>

        {hostNames && hostNames.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Input
                  variant="default"
                  value={hostNames.join(', ')}
                  readOnly
                  className="flex-1"
                />
                <Menu.Root>
                  <Menu.Trigger>
                    {({ toggle }) => (
                      <Button
                        variant="tertiary-alt"
                        onClick={toggle}
                        icon="icon-more-vert"
                        className="shrink-0"
                      />
                    )}
                  </Menu.Trigger>
                  <Menu.Content className="p-1">
                    {({ toggle }) => (
                      <MenuItem
                        title="Remove Domain"
                        onClick={() => {
                          const domain = hostNames?.[0] || '';
                          const fallbackUrl = `lemonade.social/s/${space.slug || space._id}`;
                          modal.open(ConfirmModal, {
                            props: {
                              title: 'Remove Custom Domain?',
                              subtitle: `Removing this domain will disconnect ${domain} from your community hub.\n\nPlease note: your community will still be available at: ${fallbackUrl}`,
                              icon: 'icon-person-remove',
                              buttonText: 'Remove',
                              onConfirm: async () => {
                                await handleUpdate({ hostnames: [] });
                              },
                            },
                          });
                          toggle();
                        }}
                      />
                    )}
                  </Menu.Content>
                </Menu.Root>
              </div>
              <p className="text-sm text-tertiary">Connect a new custom domain by removing the above.</p>
            </div>

            <Card.Root>
              <Card.Content className="p-0 divide-y divide-(--color-divider)">
                <div className="flex justify-between items-center py-3 px-4">
                  <div className="flex gap-3 items-center">
                    <div className="p-1.5 bg-card rounded-sm size-7 aspect-square flex items-center justify-center overflow-hidden">
                      {space?.fav_icon_url ? (
                        <img src={space.fav_icon_url} alt="Favicon" className="size-full object-contain" />
                      ) : (
                        <i className="icon-lemonade-logo text-[#FDE047] size-4" />
                      )}
                    </div>
                    <div>
                      <p>Favicon</p>
                      <p className="text-sm text-tertiary">32x32px ICO, PNG, GIF, or JPG file recommended.</p>
                    </div>
                  </div>
                  <FileInput
                    accept="image/*"
                    multiple={false}
                    onChange={handleFaviconUpload}
                  >
                    {(open) => (
                      <Button size="sm" variant="tertiary-alt" onClick={open} loading={uploadingFavicon}>
                        Change Favicon
                      </Button>
                    )}
                  </FileInput>
                </div>

                <div
                  className="flex justify-between items-center py-3 px-4"
                  onClick={() => modal.open(TitleDescModal, { props: { space } })}
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-1.5 bg-card rounded-sm size-7 aspect-square flex items-center justify-center">
                      <i className="icon-info text-tertiary size-4" />
                    </div>
                    <div>
                      <p>Title & Description</p>
                      <p className="text-sm text-tertiary">
                        {space.title} - {space.description}
                      </p>
                    </div>
                  </div>
                  <i className="icon-chevron-right size-5 aspect-square text-quaternary" />
                </div>
              </Card.Content>
            </Card.Root>
          </>
        ) : (
          <Button
            variant="secondary"
            className="w-fit"
            onClick={() => drawer.open(CustomDomainPane, { props: { space } })}
          >
            Add Domain
          </Button>
        )}
      </div>

      <Divider />

      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Community Status</h3>
          <p className="text-secondary">Mark the community as coming soon or archive it if it is no longer active.</p>
        </div>

        <Card.Root className="overflow-visible">
          <Card.Content className="p-0 divide-y divide-(--color-divider)">
            <div className="flex justify-between items-center py-3 px-4">
              <div className="flex gap-3 items-center">
                <div className="p-1.5 rounded-sm size7 aspect-square flex items-center justify-center bg-success-400/16">
                  <i className="icon-calendar text-success-400 size-4" />
                </div>
                <div>
                  <p className="text-success-400 capitalize"> {space.state}</p>
                  <p className="text-sm text-tertiary">
                    The community is active and accepting subscriptions and event submissions.
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="tertiary-alt"
                className="capitalize"
                onClick={() => modal.open(ChangeStatusModal, { props: { space } })}
              >
                Change Status
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <Divider />

      <div>
        <Button
          iconLeft="icon-delete"
          variant="flat"
          className="text-danger-400!"
          size="sm"
          onClick={() =>
            modal.open(ConfirmModal, {
              props: {
                title: 'Delete Community?',
                subtitle: `You are about to permanently delete ${space.title}. This operation can't be undone. Are you sure you want to delete it?`,
                buttonText: 'Delete',
                onConfirm: async () => {
                  await deleteSpace({ variables: { id: space._id } });
                },
              },
            })
          }
        >
          Permanently Delete Community
        </Button>
      </div>
    </div>
  );
}
