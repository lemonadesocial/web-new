'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { useAtom, useSetAtom } from 'jotai';
import React from 'react';

import { Button, modal, Spacer } from '$lib/components/core';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { FollowSpaceDocument, Space, UnfollowSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useMutation } from '$lib/graphql/request';
import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';

import { COMMUNITY_SOCIAL_LINKS } from './constants';
import { ThemeBuilder } from './theme_builder';
import { defaultTheme, themeAtom } from './theme_builder/store';

interface HeroSectionProps {
  space?: Space | null;
}

export function HeroSection({ space }: HeroSectionProps) {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const signIn = useSignIn();

  const setThemeAtom = useSetAtom(themeAtom);

  const [follow, resFollow] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: true } });
    },
  });
  const [unfollow, resUnfollow] = useMutation(UnfollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: false } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      // need to login to subscribe
      signIn();
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  const handleCloseSheet = () => {
    if (!saved) {
      modal.open(ConfirmModal, {
        props: {
          onDiscard: () => {
            setOpenSheet(false);
            document.getElementById(space?._id)?.setAttribute('class', space?.theme_data?.config?.mode || 'dark');
            setThemeAtom(space?.theme_data || defaultTheme);
          },
        },
      });
      sheetRef.current?.snapTo(0);
    } else {
      setOpenSheet(false);
    }
  };

  const canManage = [space?.creator, ...(space?.admins?.map((p) => p._id) || [])].filter((p) => p).includes(me?._id);

  const [openSheet, setOpenSheet] = React.useState(false);
  const [saved, setSaved] = React.useState(true);
  const sheetRef = React.useRef<SheetRef>(null);

  return (
    <>
      <div className="relative w-full h-[154px] md:h-96 overflow-hidden">
        {space?.image_cover && (
          <>
            <img
              className="md:hidden aspect-[3.5/1] object-cover rounded-md w-full max-h-2/3"
              alt={space?.title as string}
              loading="lazy"
              src={generateUrl(space?.image_cover_expanded, {
                resize: { width: 480, fit: 'contain' },
              })}
            />
            <img
              src={generateUrl(space?.image_cover_expanded, {
                resize: { width: 1080, fit: 'contain' },
              })}
              loading="lazy"
              alt={space?.title as string}
              className="hidden md:block aspect-[3.5/1] object-cover rounded-md w-full"
            />
          </>
        )}

        <div className="absolute bottom-1.5 md:bottom-4 outline-6 outline-background size-20 md:size-32 rounded-md overflow-hidden">
          {space?.image_avatar && (
            <img
              className="w-full h-full outline outline-tertiary/4 rounded-md"
              src={generateUrl(space?.image_avatar_expanded, { resize: { width: 384, height: 384, fit: 'contain' } })}
              alt={space?.title}
              loading="lazy"
            />
          )}
        </div>

        {/* Subscribe button */}
        <div className="absolute bottom-0 md:bottom-4 right-0">
          <div className="flex items-center gap-3">
            {[space?.creator, ...(space?.admins?.map((p) => p._id) || [])].includes(me?._id) && (
              <Button
                icon="icon-palette-outline"
                outlined
                size="lg"
                onClick={() => {
                  setOpenSheet(true);
                  // sheet.open(ThemeBuilder, { snapPoints: [324], props: { space } });
                }}
              />
            )}
            {canManage ? (
              <Link href={`${LEMONADE_DOMAIN}/s/${space?.slug || space?._id}/overview`} target="_blank">
                <Button variant="primary" outlined iconRight="icon-arrow-outward" size="lg">
                  <span className="block">Manage</span>
                </Button>
              </Link>
            ) : (
              !space?.is_ambassador && (
                <Button
                  loading={resFollow.loading || resUnfollow.loading}
                  outlined={!!space?.followed}
                  variant="primary"
                  size="lg"
                  className={clsx(space?.followed && 'hover:bg-accent-500 hover:text-tertiary w-auto duration-300')}
                  onClick={() => handleSubscribe()}
                >
                  {!!space?.followed ? (
                    <>
                      <span className="hidden group-hover:block">Unsubscribe</span>
                      <span className="block group-hover:hidden">Subscribed</span>
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
      <Spacer className="h-6" />
      <div>
        <h1 className="text-2xl text-primary md:text-3xl font-semibold">{space?.title}</h1>
        <p className="text-sm md:text-md text-secondary font-medium">{space?.description}</p>
        <Spacer className="h-3" />
        <div className="flex items-center gap-3">
          {COMMUNITY_SOCIAL_LINKS.filter((item) => space?.[item.key as keyof Space]).map((item) => (
            <div key={item.key} className="tooltip sm:tooltip">
              <div className="tooltip-content">
                <div className="text-sm font-medium">
                  <span className="capitalize">{item.key.replace('handle_', '')}</span>:{' '}
                  {space?.[item.key as keyof Space]}
                </div>
              </div>
              <i
                className={`${item.icon} tooltip tooltip-open cursor-pointer text-tertiary hover:text-primary`}
                onClick={() => window.open(`${item.prefix}${space?.[item.key as keyof Space]}`, '_blank')}
              />
            </div>
          ))}
        </div>
      </div>

      <Sheet ref={sheetRef} isOpen={openSheet} onClose={handleCloseSheet} snapPoints={[324]} initialSnap={0}>
        <Sheet.Backdrop onTap={handleCloseSheet} />

        <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
          <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
            <div className="flex justify-center items-end h-[20px]">
              <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
            </div>
          </Sheet.Header>
          <Sheet.Content disableDrag>
            <Sheet.Scroller draggableAt="top">
              <ThemeBuilder
                space={space}
                onClose={(saved: boolean) => setSaved(saved)}
                onSave={() => setOpenSheet(false)}
              />
            </Sheet.Scroller>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
}

function ConfirmModal({ onDiscard }: { onDiscard: () => void }) {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-info text-danger-400" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">Discard Customizations?</p>
        <p className="text-sm font-medium text-secondary">
          Your theme changes haven’t been applied. Discard them or go back to keep editing.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={() => {
            modal.close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => {
            modal.close();
            onDiscard();
          }}
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
