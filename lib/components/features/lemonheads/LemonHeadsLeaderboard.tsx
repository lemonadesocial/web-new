'use client';
import React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { Badge, Button, Card, modal, Skeleton } from '$lib/components/core';
import {
  GetLemonheadInvitationRankDocument,
  GetMyLemonheadInvitationRankDocument,
  LemonheadUserInfo,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';
import { truncateMiddle } from '$lib/utils/string';
import { LemonheadLeaderBoardRank } from '$lib/components/features/lemonheads/LemonheadLeaderBoardRank';

import { EmptyLeaderboard } from '$lib/components/features/lemonheads/EmptyLeaderboard';
import { LemonHeadsRightCol } from '$lib/components/features/lemonheads/LemonheadsRightCol';
import { InviteFriendModal } from '$lib/components/features/lemonheads/cards/InviteCard';

const limit = 20;

export function LemonHeadsLeaderboard() {
  const [skip, setSkip] = React.useState(0);

  const { data: dataGetMyRank } = useQuery(GetMyLemonheadInvitationRankDocument);
  const myLemonheadRank = dataGetMyRank?.getMyLemonheadInvitationRank;

  const { data: dataGetInvitationRank, loading } = useQuery(GetLemonheadInvitationRankDocument, {
    variables: { skip, limit },
  });
  const invitationRank = dataGetInvitationRank?.getLemonheadInvitationRank.items || [];
  const totalInvitations = dataGetInvitationRank?.getLemonheadInvitationRank.total || 0;

  const getUsernameOrWallet = (user: LemonheadUserInfo) => {
    if (user.username) return user.username;
    else if (user.lemonhead_inviter_wallet) return truncateMiddle(user.lemonhead_inviter_wallet, 6, 4);
    else if (user.kratos_wallet_address) return truncateMiddle(user.kratos_wallet_address, 6, 4);
    else return '';
  };

  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-5 w-full">
        {!!myLemonheadRank?.invitations_count && myLemonheadRank?.invitations_count > 0 && (
          <Card.Root>
            <Card.Content className="flex gap-4 py-3 items-center">
              <LemonheadLeaderBoardRank rank={myLemonheadRank?.rank || 0} />
              <div className="flex gap-3 items-center flex-1">
                <img
                  src={userAvatar(myLemonheadRank?.user as unknown as User)}
                  className="size-8 aspect-square rounded-full"
                />
                <p>{getUsernameOrWallet(myLemonheadRank?.user as LemonheadUserInfo)}</p>
                <Badge title="Your Rank" color="var(--color-tertiary)" className="rounded-full" />
              </div>
              <p className="md:w-[96px]">{myLemonheadRank?.invitations_count}</p>

              <div
                className={clsx(
                  'w-[62px] hidden md:flex justify-end',
                  !!myLemonheadRank?.invitations_count && myLemonheadRank?.invitations_count === 5 && 'invisible',
                )}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full"
                  onClick={() => modal.open(InviteFriendModal)}
                >
                  Invite
                </Button>
              </div>
            </Card.Content>
          </Card.Root>
        )}

        <div className="flex flex-col gap-3">
          <Card.Root>
            {(!!invitationRank.length || loading) && (
              <Card.Header className="flex gap-4 bg-transparent border-b-(length:--card-border-width)">
                <p className="w-8 text-sm text-tertiary">Rank</p>
                <p className="flex-1 text-sm text-tertiary">Inviter</p>
                <p className="text-sm text-tertiary">Invites</p>
                {/* <div className="hidden md:block w-[62px]" /> */}
              </Card.Header>
            )}

            <AnimatePresence mode="wait">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {Array.from({ length: 7 }).map((_, idx) => (
                      <Card.Content
                        key={idx}
                        className={clsx('py-3', idx % 2 === 0 && 'backdrop-blur-sm', idx > 4 && 'max-sm:hidden')}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-4"
                        >
                          <Skeleton className="size-8 aspect-square rounded-full" animate />

                          <div className="flex gap-3 items-center flex-1">
                            <Skeleton className="size-8 aspect-square rounded-full" animate />
                            <Skeleton className="h-5 w-32" animate />
                          </div>

                          <Skeleton className="h-5 w-10" animate />

                          {/* <div className="w-[62px] px-[60px] hidden md:block"> */}
                          {/*   <Skeleton className="h-5 w-16 rounded-full" animate /> */}
                          {/* </div> */}
                        </motion.div>
                      </Card.Content>
                    ))}
                  </motion.div>
                ) : (
                  <>
                    <div className="hidden only:block ">
                      <EmptyLeaderboard />
                    </div>
                    <div className="divide-y-(length:--card-border-width)">
                      {invitationRank.map((item, idx) => (
                        <Card.Content key={idx} className={clsx('py-3', idx % 2 === 0 && 'backdrop-blur-sm')}>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-4"
                          >
                            <LemonheadLeaderBoardRank rank={item.rank} />
                            <div className="flex gap-3 items-center flex-1">
                              <img
                                src={userAvatar(item?.user as unknown as User)}
                                className="size-8 aspect-square rounded-full"
                              />
                              <p>{getUsernameOrWallet(item.user as LemonheadUserInfo)}</p>
                            </div>
                            <p className="">{item?.invitations_count}</p>
                            {/* <div className="w-[62px] hidden md:block"> */}
                            {/*   <Button variant="tertiary-alt" size="sm" className="rounded-full"> */}
                            {/*     Follow */}
                            {/*   </Button> */}
                            {/* </div> */}
                          </motion.div>
                        </Card.Content>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </Card.Root>

          {totalInvitations > limit && (
            <div className="flex justify-between items-center">
              <Button
                icon="icon-arrow-back-sharp"
                size="sm"
                variant="tertiary-alt"
                className="rounded-full"
                disabled={skip === 0}
                onClick={() => setSkip((prev) => prev - limit)}
              />
              <p className="text-sm text-tertiary">Page {skip / limit + 1}</p>
              <Button
                icon="icon-arrow-back-sharp rotate-180"
                size="sm"
                variant="tertiary-alt"
                className="rounded-full"
                disabled={totalInvitations - skip < limit}
                onClick={() => setSkip((prev) => prev + limit)}
              />
            </div>
          )}
        </div>
      </div>

      <LemonHeadsRightCol options={{ nft: false, invite: true, treasury: false }} />
    </div>
  );
}
