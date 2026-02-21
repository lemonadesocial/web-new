'use client';
import { match, P } from 'ts-pattern';

import { Card } from '$lib/components/core';
import { useAppKitAccount } from '@reown/appkit/react';
import { LemonHeadsNFTCard } from './cards/LemonHeadsNFTCard';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '$lib/graphql/request';
import {
  Event,
  GetLemonheadInvitationRankDocument,
  GetSpaceEventsDocument,
  LemonheadUserInfo,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { truncateMiddle } from '$lib/utils/string';
import { generateUrl } from '$lib/utils/cnd';
import { randomEventDP, userAvatar } from '$lib/utils/user';
import { formatWithTimezone } from '$lib/utils/date';

const FROM_NOW = new Date().toISOString();

export function LemonHeadsHubRightCol({
  spaceId,
  options = { passport: true, nft: true, upcomingEvents: true, leaderboard: true },
}: {
  spaceId?: string;
  options?: { passport?: boolean; nft?: boolean; upcomingEvents?: boolean; leaderboard?: boolean };
}) {
  const { address } = useAppKitAccount();
  const { data } = useLemonhead();
  const locked = !address || !data || (data && data.tokenId == 0);

  const router = useRouter();
  const pathname = usePathname();

  const { data: dataGetUpcomingEvents } = useQuery(GetSpaceEventsDocument, {
    variables: {
      space: spaceId,
      limit: 3,
      skip: 0,
      endFrom: FROM_NOW,
    },
    skip: !spaceId || locked || !options.upcomingEvents,
  });
  const upcomingEvents = (dataGetUpcomingEvents?.getEvents || []) as Event[];

  const { data: dataGetInvitationRank } = useQuery(GetLemonheadInvitationRankDocument, {
    variables: { skip: 0, limit: 3 },
    skip: !options.leaderboard,
  });
  const invitationRank = dataGetInvitationRank?.getLemonheadInvitationRank.items || [];

  const getUsernameOrWallet = (user: LemonheadUserInfo) => {
    if (user.username) return user.username;
    if (user.lemonhead_inviter_wallet) return truncateMiddle(user.lemonhead_inviter_wallet, 6, 4);
    if (user.kratos_wallet_address) return truncateMiddle(user.kratos_wallet_address, 6, 4);
    return '';
  };

  return (
    <div className="flex items-center gap-2 md:block w-full md:w-[296px] space-y-4 overflow-auto no-scrollbar">
      {/* {options.passport && <PassportCard />} */}

      {options.nft && <LemonHeadsNFTCard />}

      {!locked && !!upcomingEvents.length && options.upcomingEvents && (
        <>
          <CardGroupMobile
            title="Events"
            icon={
              <div className="bg-accent-600/16 size-8 aspect-square rounded-sm flex items-center justify-center">
                <i className="icon-ticket text-accent-600 size-5 aspect-square" />
              </div>
            }
            subtitle={`${upcomingEvents.length} upcoming`}
            onViewAll={() => router.push(`${pathname}/events`)}
          />

          <CardGroup title="Upcoming Events" onViewAll={() => router.push(`${pathname}/events`)}>
            {upcomingEvents.map((item) => (
              <div key={item._id} className="flex items-center gap-3 group">
                {!!item?.new_new_photos_expanded?.[0] && (
                  <img
                    className="aspect-square object-contain rounded-sm size-8 border border-(--color-card-border)"
                    src={
                      item.new_new_photos_expanded?.[0]
                        ? generateUrl(item.new_new_photos_expanded[0], {
                            resize: { height: 32, width: 32, fit: 'cover' },
                          })
                        : randomEventDP()
                    }
                    loading="lazy"
                    alt={item.title}
                  />
                )}
                <div>
                  <p
                    className="group-hover:underline line-clamp-1 cursor-pointer"
                    onClick={() => router.push(`/e/${item.shortid}`)}
                  >
                    {item.title}
                  </p>
                  <p className="text-tertiary text-sm">
                    {formatWithTimezone(item.start, `EEE, MMM dd 'at' hh:mm a`, item.timezone)}
                  </p>
                </div>
              </div>
            ))}
          </CardGroup>
        </>
      )}

      {!!invitationRank.length && options.leaderboard && (
        <>
          <CardGroupMobile
            title="Leaderboard"
            icon={
              <div className="bg-warning-600/16 size-8 aspect-square rounded-sm flex items-center justify-center">
                <i className="icon-bar-chart text-warning-600 size-5 aspect-square" />
              </div>
            }
            subtitle="Climb the ranks!"
            onViewAll={() => router.push(`${pathname}/leaderboards`)}
          />
          <CardGroup title="Leaderboard" onViewAll={() => router.push(`${pathname}/leaderboards`)}>
            {invitationRank.map((item, idx) => (
              <div key={idx}>
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
        </>
      )}
    </div>
  );
}

function CardGroup({ title, onViewAll, children }: { title: string; onViewAll: () => void } & React.PropsWithChildren) {
  return (
    <>
      <Card.Root className="bg-transparent hidden md:block">
        <Card.Content className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-tertiary">
            <p>{title}</p>
            <i
              className="icon-arrow-outward text-quaternary size-6 hover:text-primary cursor-pointer"
              onClick={onViewAll}
            />
          </div>
          {children}
        </Card.Content>
      </Card.Root>
    </>
  );
}

function CardGroupMobile({
  title,
  subtitle,
  icon,
  onViewAll,
}: {
  title: string;
  subtitle?: string;
  icon?: string | React.ReactElement;
  onViewAll: () => void;
}) {
  return (
    <Card.Root className="bg-transparent md:hidden min-w-fit" onClick={onViewAll}>
      <Card.Content className="flex items-center py-2.5 px-3 gap-2.5">
        {match(icon)
          .with(P.string, () => <i className={icon as string} />)
          .otherwise(() => icon)}
        <div className="">
          <p className="text-sm">{title}</p>
          <p className="text-xs text-tertiary">{subtitle}</p>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
