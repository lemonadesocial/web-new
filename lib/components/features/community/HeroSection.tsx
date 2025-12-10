'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { useAtom } from 'jotai';
import React from 'react';
import linkify from 'linkify-it';

import { Button, Spacer } from '$lib/components/core';
import { ASSET_PREFIX, LEMONADE_DOMAIN } from '$lib/utils/constants';
import { FollowSpaceDocument, Space, UnfollowSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useMutation } from '$lib/graphql/request';
import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';

import { COMMUNITY_SOCIAL_LINKS } from './constants';
import { communityAvatar } from '$lib/utils/community';
import { CommunityThemeBuilder } from '$lib/components/features/theme-builder/CommunityThemeBuilder';

interface HeroSectionProps {
  space?: Space | null;
  renderTitle?: () => React.ReactElement;
}

export function HeroSection({ space, renderTitle }: HeroSectionProps) {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const signIn = useSignIn();

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

  const canManage = [space?.creator, ...(space?.admins?.map((p) => p._id) || [])].filter((p) => p).includes(me?._id);

  return (
    <>
      <div
        className={clsx('relative w-full overflow-hidden', space?.image_cover ? 'h-[154px] md:h-96' : 'h-24 md:h-36')}
      >
        {space?.image_cover ? (
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
        ) : (
          <div className="absolute inset-0 top-0 left-0 aspect-[3.5/1] object-cover rounded-md w-full bg-blend-darken"></div>
        )}

        <div className="absolute bottom-1.5 md:bottom-4 size-20 md:size-32 rounded-md overflow-hidden">
          <img
            className="w-full h-full outline outline-tertiary/4 rounded-md"
            src={communityAvatar(space)}
            alt={space?.title}
            loading="lazy"
          />
          {!space?.image_avatar_expanded && (
            <img
              src={`${ASSET_PREFIX}/assets/images/blank-avatar.svg`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 icon-blank-avatar w-[62%] h-[62%]"
            />
          )}
        </div>

        {/* Subscribe button */}
        <div className="absolute bottom-0 md:bottom-4 right-0">
          <div className="flex items-center gap-3">
            {[space?.creator, ...(space?.admins?.map((p) => p._id) || [])].includes(me?._id) && (
              <CommunityThemeBuilder themeData={space?.theme_data} spaceId={space?._id} />
            )}
            {canManage ? (
              <Link href={`/s/manage/${space?.slug || space?._id}`} target="_blank">
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
        <h1 className="community-title text-2xl text-primary md:text-3xl font-semibold">{space?.title}</h1>
        <div className="text-sm md:text-md text-secondary font-medium whitespace-pre-wrap">
          {renderTextWithLinks(space?.description || '')}
        </div>
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
                className={`${item.icon} tooltip tooltip-open cursor-pointer text-tertiary size-5 hover:text-primary`}
                onClick={() => window.open(`${item.prefix}${space?.[item.key as keyof Space]}`, '_blank')}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// TODO: it could be render more. just link for now
function renderTextWithLinks(text?: string) {
  if (!text) return null;

  const matches = new linkify().match(text);
  if (!matches) return text;

  let lastIndex = 0;
  const elements = [];

  matches.forEach((match: any) => {
    // Push the text before the match
    if (lastIndex < match.index) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Create a link element for the match
    elements.push(
      <a key={match.index} href={match.url} target="_blank" rel="noopener noreferrer" className="underline">
        {match.raw}
      </a>,
    );

    lastIndex = match.lastIndex;
  });

  // Push the remaining text after the last match
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}
