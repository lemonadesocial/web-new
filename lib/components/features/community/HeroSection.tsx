'use client';
import React from 'react';
import clsx from 'clsx';

import { Button, sheet, Spacer } from '$lib/components/core';
import {
  FollowSpaceDocument,
  Space,
  UnfollowSpaceDocument,
  UpdateSpaceDocument,
  User,
} from '$lib/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useMutation } from '$lib/request';

import { COMMUNITY_SOCIAL_LINKS } from './constants';
import ThemeBuilder from './ThemeBuilder';
import Link from 'next/link';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';

interface HeroSectionProps {
  space?: Space | null;
  me?: User | null;
}

export function HeroSection({ me, space }: HeroSectionProps) {
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

  const handleSubcribe = () => {
    if (!me) {
      // need to login to subscribe
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  const canManage = [space?.creator, space?.admins?.map((p) => p._id)].filter((p) => p).includes(me?._id);

  return (
    <>
      <div className="relative w-full h-44 md:h-96 overflow-hidden">
        {space?.image_cover && (
          <picture>
            <source
              media="(max-width:30rem)"
              srcSet={generateUrl(space?.image_cover_expanded, {
                resize: { width: 480, height: 480 * 3.5, fit: 'contain' },
              })}
            />
            <img
              src={generateUrl(space?.image_cover_expanded, {
                resize: { width: 1080, height: 1080 * 3.5, fit: 'contain' },
              })}
              alt={space?.title as string}
              className="aspect-[3.5/1] object-cover object-cover rounded-md w-full"
            />
          </picture>
        )}

        <div className="absolute bottom-8 md:bottom-4 outline-6 outline-background size-16 md:size-32 rounded-md overflow-hidden shadow-lg">
          {space?.image_avatar && (
            <img
              className="w-full h-full outline outline-tertiary/[0.04] rounded-md"
              src={generateUrl(space?.image_avatar_expanded, { resize: { width: 80, height: 56 } })}
              alt={space?.title}
            />
          )}
        </div>

        {/* Subscribe button */}
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center gap-3">
            {[space?.creator, ...(space?.admins?.map((p) => p._id) || [])].includes(me?._id) && (
              <Button
                icon="icon-dark-theme-filled"
                outlined
                onClick={() => {
                  sheet.open(ThemeBuilder, { snapPoints: [324], props: { space } });
                }}
              />
            )}
            {canManage ? (
              <Link href={`${LEMONADE_DOMAIN}/s/${space?.slug || space?._id}`} target="_blank">
                <Button variant="primary" outlined iconRight="icon-arrow-outward">
                  <span className="block">Manage</span>
                </Button>
              </Link>
            ) : (
              <Button
                loading={resFollow.loading || resUnfollow.loading}
                outlined={!!space?.followed}
                variant="primary"
                className={clsx(space?.followed && 'hover:bg-primary-500 hover:text-tertiary w-auto duration-300')}
                onClick={() => handleSubcribe()}
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
            )}
          </div>
        </div>
      </div>

      <Spacer className="h-6" />
      <div>
        <h1 className="text-3xl font-semibold">{space?.title}</h1>
        <p className="text-md text-tertiary/[0.8] font-medium">{space?.description}</p>
        <Spacer className="h-3" />
        <div className="flex items-center gap-3">
          {COMMUNITY_SOCIAL_LINKS.filter((item) => space?.[item.key as keyof Space]).map((item) => (
            <Button
              key={item.key}
              aria-label={item.key}
              variant="flat"
              size="sm"
              icon={item.icon}
              className="text-tertiary/[0.56] border-transparent"
              onClick={() => window.open(`${item.prefix}${space?.[item.key as keyof Space]}`, '_blank')}
            />
          ))}
        </div>
      </div>
    </>
  );
}
