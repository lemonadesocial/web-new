'use client';
import React from 'react';
import { useEvent } from '../../event-manage/store';
import {
  DeletePreviewLinkDocument,
  ListPreviewLinksDocument,
  PreviewLink,
  PreviewLinkType,
} from '$lib/graphql/generated/backend/graphql';
import { Badge, Button, Card, InputField, Menu, MenuItem, modal, toast, Skeleton } from '$lib/components/core';
import { copy } from '$lib/utils/helpers';

import { EventThemeProvider } from '../../theme-builder/provider';
import { EventThemeLayout } from '../../event-manage/EventThemeLayout';
import { EventGuestSideContent } from '../../event/EventGuestSide';
import { CreatePreviewLinkModal } from './CreatePreviewLinkModal';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useStoreManageLayout } from './store';

export function PreviewLinkPopup({ hideCard }: { hideCard?: boolean }) {
  const event = useEvent();
  const state = useStoreManageLayout();

  const [links, setLinks] = React.useState<PreviewLink[]>([]);

  const formatExpires = (isoString: string) => {
    const targetUnix = Math.floor(new Date(isoString).getTime() / 1000);
    const nowUnix = Math.floor(Date.now() / 1000);

    const diffInSeconds = targetUnix - nowUnix;
    if (diffInSeconds <= 0) return 'Expired';

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);

    if (hours === 0) return minutes > 0 ? `Expires in ${minutes}m` : 'Expires in < 1m';

    const minsPart = minutes > 0 ? ` ${minutes}m` : '';
    return `Expires in ${hours}h${minsPart}`;
  };

  const { loading: loadingLinks } = useQuery(ListPreviewLinksDocument, {
    variables: {
      resource_id: state.data?._id,
      link_type: Object.values(PreviewLinkType).includes(state.layoutType as PreviewLinkType)
        ? (state.layoutType as PreviewLinkType)
        : PreviewLinkType.Event,
    },
    skip: !state.data?._id,
    onComplete: (data) => {
      setLinks(data.listPreviewLinks as PreviewLink[]);
    },
    onError: () => {
      toast.error('Failed to load preview links');
    },
  });
  const [deleteLink] = useMutation(DeletePreviewLinkDocument, {
    onError: (error, _variables, context: any) => {
      toast.error('Failed to delete link');
      if (context?.previousLinks) {
        setLinks(context.previousLinks);
      }
    },
  });

  const handleDelete = (id: string) => {
    const previousLinks = [...links];
    setLinks((prev) => prev.filter((i) => i._id !== id));
    deleteLink({
      variables: { id },
      onComplete: () => {
        toast.success('Link deleted');
      },
    });
  };

  const content = (
    <div className="space-y-4 max-h-[648px] overflow-auto p-4">
      <div className="space-y-2">
        <p className="text-lg">Preview Links</p>
        <p className="text-secondary text-sm">
          Create a public view link to allow anyone to access a view-only version of this design. No sign-in required.
        </p>
      </div>
      <div className="rounded-sm border border-(--color-divider) aspect-[157/88] relative overflow-hidden">
        <div className="absolute scale-50 origin-top-left w-[200%]" data-mode="desktop">
          {state.layoutType === PreviewLinkType.Event && event && (
            <EventThemeProvider themeData={event.theme_data}>
              <EventThemeLayout>
                <EventGuestSideContent event={event} />
              </EventThemeLayout>
            </EventThemeProvider>
          )}
        </div>
      </div>

      {loadingLinks ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Skeleton animate className="h-10 w-full rounded-sm" />
                <Skeleton animate className="size-10 rounded-sm" />
                <Skeleton animate className="size-10 rounded-sm" />
              </div>
              <div className="flex gap-1.5">
                <Skeleton animate className="h-5 w-24 rounded-full" />
                <Skeleton animate className="h-5 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        links.map((item) => {
          const url = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN ?? (typeof window !== 'undefined' ? window.location.hostname : '')}/preview/${item.token}`;
          return (
            <div key={item._id} className="flex flex-col gap-2">
              <div className="flex gap-2 items-end">
                <InputField label="Preview Link" value={url} className="w-full" readOnly />
                <Button
                  icon="icon-copy"
                  variant="tertiary-alt"
                  className="size-[40px] aspect-square"
                  onClick={() => copy(url, () => toast.success('Copied to clipboard! 📋'))}
                />
                <Menu.Root placement="bottom-end">
                  <Menu.Trigger>
                    {({ toggle }) => (
                      <Button
                        icon="icon-more-horiz"
                        variant="tertiary-alt"
                        className="size-[40px] aspect-square"
                        onClick={() => toggle()}
                      />
                    )}
                  </Menu.Trigger>

                  <Menu.Content className="p-1">
                    {({ toggle }) => (
                      <>
                        <MenuItem
                          title="Delete Link"
                          iconLeft="icon-delete text-danger-400!"
                          className="[&_p]:text-danger-400!"
                          onClick={() => {
                            handleDelete(item._id);
                            toggle();
                          }}
                        />
                      </>
                    )}
                  </Menu.Content>
                </Menu.Root>
              </div>
              <div className="flex gap-1.5">
                {!!item.password && (
                  <Badge title="Password Protected" color="var(--color-secondary)" className="rounded-full" />
                )}

                {!!item.expires_at && (
                  <Badge
                    title={formatExpires(item.expires_at)}
                    color="var(--color-warning-400)"
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })
      )}

      <div className="flex flex-col gap-3 items-center">
        <Button
          variant={links.length ? 'tertiary-alt' : 'secondary'}
          className="w-full"
          disabled={!state.data?._id}
          onClick={() => {
            modal.open(CreatePreviewLinkModal, {
              dismissible: true,
              props: {
                linkType: state.layoutType as PreviewLinkType,
                resourceId: state.data?._id,
                onComplete: (link) => setLinks((prev) => [...prev, link]),
              },
              className: 'overflow-auto!',
            });
          }}
        >
          {links.length ? 'Add Another Link' : 'Create Preview Link'}
        </Button>
        <p className="text-sm text-tertiary">This link can be deleted at any time.</p>
      </div>
    </div>
  );

  if (hideCard) return content;

  return (
    <Card.Root>
      <Card.Content className="p-0">{content}</Card.Content>
    </Card.Root>
  );
}
