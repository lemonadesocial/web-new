'use client';
import clsx from 'clsx';
import Link from 'next/link';
import linkify from 'linkify-it';
import { usePathname, useRouter } from 'next/navigation';
import { match } from 'ts-pattern';

import { Button, Card, Divider } from '$lib/components/core';
import CommunityCard from '$lib/components/features/community/CommunityCard';
import { CommunityThemeBuilder } from '$lib/components/features/theme-builder/CommunityThemeBuilder';

import {
  Event,
  FollowSpaceDocument,
  GetLemonheadInvitationRankDocument,
  GetSpaceEventsDocument,
  GetSubSpacesDocument,
  LemonheadUserInfo,
  PublicSpace,
  Space,
  UnfollowSpaceDocument,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { generateUrl } from '$lib/utils/cnd';
import { communityAvatar } from '$lib/utils/community';
import { ASSET_PREFIX, LEMONADE_DOMAIN, LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { COMMUNITY_SOCIAL_LINKS } from '$lib/components/features/community/constants';
import { PostComposer } from '$lib/components/features/lens-feed/PostComposer';
import { FeedPosts } from '$lib/components/features/lens-feed/FeedPosts';
import { usePost } from '$lib/hooks/useLens';
import { LemonHeadsProgressBar } from '$lib/components/features/lemonheads/LemonHeadsProgressBar';
import { LemonHeadsNFTCard } from '$lib/components/features/lemonheads/LemonHeadsNFTCard';
import { formatWithTimezone } from '$lib/utils/date';
import { userAvatar } from '$lib/utils/user';
import { truncateMiddle } from '$lib/utils/string';

export function HeroSection({ space }: { space?: Space }) {
  const me = useMe();
  const canManage = [space?.creator, ...(space?.admins?.map((p) => p._id) || [])].filter((p) => p).includes(me?._id);

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
    if (!me) {
      // need to login to subscribe
      signIn();
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  return (
    <div className={clsx('relative w-full overflow-hidden', space?.image_cover ? 'h-[154px] md:h-96' : 'h-24 md:h-36')}>
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
            <Link href={`${LEMONADE_DOMAIN}/manage/community/${space?.slug || space?._id}`} target="_blank">
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
  );
}

export function CommunityInfoSection({ space }: { space: Space }) {
  return (
    <div className="fle flex-col gap-2">
      <h1 className="community-title text-2xl text-primary-invert! md:text-3xl font-semibold">{space?.title}</h1>
      <div className="text-sm md:text-md text-secondary font-medium whitespace-pre-wrap">
        {renderTextWithLinks(space?.description || '')}
      </div>
      <div className="flex items-center gap-3 mt-1">
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
  );
}

function TitleSection({ children }: React.PropsWithChildren) {
  return <h3 className="text-2xl font-semibold text-primary-invert!">{children}</h3>;
}

export function JourneySection() {
  return (
    <>
      <Divider className="h-2" />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <TitleSection>Featured Hubs</TitleSection>
          {/* <Button variant="tertiary-alt" size="sm" iconLeft="icon-user-plus"> */}
          {/*   Invite */}
          {/* </Button> */}
        </div>
        <LemonHeadsProgressBar />
      </div>
    </>
  );
}

export function FeatureHubSection({ spaceId }: { spaceId?: string }) {
  const { data: subSpacesData, loading } = useQuery(GetSubSpacesDocument, {
    variables: { id: spaceId },
    skip: !spaceId,
  });

  const list = (subSpacesData?.getSubSpaces || []) as PublicSpace[];

  if (loading || !list.length) return null;

  return (
    <>
      <Divider className="h-2" />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <TitleSection>Featured Hubs</TitleSection>
          <Button variant="tertiary-alt" size="sm">
            View All ({list.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.slice(0, 3).map((space) => (
            <CommunityCard key={space._id} space={space} />
          ))}
        </div>
      </div>
    </>
  );
}

function CardGroup({ title, onViewAll, children }: { title: string; onViewAll: () => void } & React.PropsWithChildren) {
  return (
    <Card.Root className="bg-transparent">
      <Card.Content className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-tertiary">
          <p>{title}</p>
          <i className="icon-arrow-outward size-6 hover:text-primary cursor-pointer" onClick={onViewAll} />
        </div>
        {children}
      </Card.Content>
    </Card.Root>
  );
}

/** WARN: LEMONADE_FEED_ADDRESS should replace from BE value based on current community  */
const FROM_NOW = new Date().toISOString();
export function NewFeedSection({ spaceId }: { spaceId?: string }) {
  const router = useRouter();
  const { createPost } = usePost();
  const pathname = usePathname();

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    createPost({ metadata, feedAddress });
  };

  const onSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  const { data: dataGetUpcomingEvents } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: spaceId,
      limit: 3,
      skip: 0,
      endFrom: FROM_NOW,
      spaceTags: [],
    },
    skip: !spaceId,
  });
  const upcomingEvents = (dataGetUpcomingEvents?.getEvents || []) as Event[];

  const { data: dataGetInvitationRank } = useQuery(GetLemonheadInvitationRankDocument, {
    variables: { skip: 0, limit: 3 },
  });
  const invitationRank = dataGetInvitationRank?.getLemonheadInvitationRank.items || [];

  const getUsernameOrWallet = (user: LemonheadUserInfo) => {
    if (user.username) return user.username;
    else if (user.lemonhead_inviter_wallet) return truncateMiddle(user.lemonhead_inviter_wallet, 6, 4);
    else if (user.kratos_wallet_address) return truncateMiddle(user.kratos_wallet_address, 6, 4);
    else return '';
  };

  return (
    <div className="flex gap-12">
      <div className="flex flex-col gap-5 flex-1">
        <PostComposer onPost={onPost} showFeedOptions />
        <FeedPosts feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={onSelectPost} />
      </div>

      <div className="hidden md:block w-full max-w-[296px] space-y-4">
        <LemonHeadsNFTCard />

        {!!upcomingEvents.length && (
          <CardGroup title="Upcoming Events" onViewAll={() => router.push(`${pathname}/events`)}>
            {upcomingEvents.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                {!!item?.new_new_photos_expanded?.[0] && (
                  <img
                    className="aspect-square object-contain rounded-sm size-8 border border-(--color-card-border)"
                    src={generateUrl(item?.new_new_photos_expanded[0], {
                      resize: { height: 32, width: 32, fit: 'cover' },
                    })}
                    loading="lazy"
                    alt={item.title}
                  />
                )}
                <div>
                  <p className="line-clamp-1">{item.title} asdaskldjalsd asdjlkasd</p>
                  <p className="text-tertiary text-sm">
                    {formatWithTimezone(item.start, `EEE, MMM dd 'at' hh:mm a`, item.timezone)}
                  </p>
                </div>
              </div>
            ))}
          </CardGroup>
        )}

        {!!invitationRank.length && (
          <CardGroup title="Upcoming Events" onViewAll={() => router.push(`${pathname}/leaderboards`)}>
            {invitationRank.map((item, idx) => (
              <div className={idx}>
                <div className="flex gap-3 items-center flex-1">
                  <div className="relative">
                    <img
                      src={userAvatar(item.user as unknown as User)}
                      className="size-8 aspect-square rounded-full border"
                    />
                    <div className="absolute bottom-0 right-0 size-4 rounded-full border z-10">
                      {match(item.rank)
                        .with(1, () => (
                          <div
                            className="w-full h-full aspect-square flex items-center justify-center bg-overlay-primary mix-blend-overlay rounded-full"
                            style={{
                              background:
                                'linear-gradient(135deg, #856220 15.43%, #F4E683 34.91%, #BF923D 50.85%, #4E341B 68.56%, #F1EA82 86.26%)',
                            }}
                          >
                            <p className="text-xs">1</p>
                          </div>
                        ))
                        .with(2, () => (
                          <div
                            className="w-full h-full aspect-square flex items-center justify-center bg-overlay-primary mix-blend-overlay rounded-full"
                            style={{
                              background:
                                'linear-gradient(138deg, #3A3A3A 2.28%, #A4A4A4 19.8%, #606060 32.94%, #CECECE 50.16%, #8F8F8F 62.15%, #464646 78.69%, #696969 95.24%)',
                            }}
                          >
                            <p className="text-xs">2</p>
                          </div>
                        ))
                        .with(3, () => (
                          <div
                            className="w-full h-full aspect-square flex items-center justify-center bg-overlay-primary mix-blend-overlay rounded-full"
                            style={{
                              background:
                                'linear-gradient(135deg, #9E8976 15.43%, #7A5E50 30.62%, #F6D0AB 47.37%, #9D774E 62.96%, #C99B70 82.05%, #795F52 93.35%)',
                            }}
                          >
                            <p className="text-xs">3</p>
                          </div>
                        ))
                        .otherwise(() => null)}
                    </div>
                  </div>
                  <div>
                    {(!item.user.name || item.user.display_name) && (
                      <p>{item.user.name || item.user.display_name} Skylar Vetrovs</p>
                    )}
                    <p className="text-sm text-tertiary">{getUsernameOrWallet(item?.user as LemonheadUserInfo)}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardGroup>
        )}
      </div>
    </div>
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
