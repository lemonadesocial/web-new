'use client';
import React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

import { Badge, Button, Card, modal } from '$lib/components/core';
import {
  GetLemonheadInvitationRankDocument,
  GetMyLemonheadInvitationRankDocument,
  LemonheadUserInfo,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';
import { truncateMiddle } from '$lib/utils/string';
import { InviteFriendModal, RightCol } from '../shared';

function FirstMedal() {
  return (
    <div
      className="size-8 aspect-square rounded-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(135deg, #856220 15.43%, #F4E683 34.91%, #BF923D 50.85%, #4E341B 68.56%, #F1EA82 86.26%)',
      }}
    >
      <div className="bg-page-background-overlay flex items-center justify-center size-6 aspect-square rounded-full mix-blend-overlay">
        <p className="text-sm">1</p>
      </div>
    </div>
  );
}

function SecondMedal() {
  return (
    <div
      className="size-8 aspect-square rounded-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(138deg, #3A3A3A 2.28%, #A4A4A4 19.8%, #606060 32.94%, #CECECE 50.16%, #8F8F8F 62.15%, #464646 78.69%, #696969 95.24%)',
      }}
    >
      <div className="bg-page-background-overlay flex items-center justify-center size-6 aspect-square rounded-full mix-blend-overlay">
        <p className="text-sm">2</p>
      </div>
    </div>
  );
}

function ThirdMedal() {
  return (
    <div
      className="size-8 aspect-square rounded-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(135deg, #9E8976 15.43%, #7A5E50 30.62%, #F6D0AB 47.37%, #9D774E 62.96%, #C99B70 82.05%, #795F52 93.35%)',
      }}
    >
      <div className="bg-page-background-overlay flex items-center justify-center size-6 aspect-square rounded-full mix-blend-overlay">
        <p className="text-sm">3</p>
      </div>
    </div>
  );
}

const limit = 20;

function Page() {
  const [skip, setSkip] = React.useState(0);

  const { data: dataGetMyRank, loading } = useQuery(GetMyLemonheadInvitationRankDocument);
  const myLemonheadRank = dataGetMyRank?.getMyLemonheadInvitationRank;

  const { data: dataGetInvitationRank } = useQuery(GetLemonheadInvitationRankDocument, {
    variables: { skip, limit },
  });
  const invitationRank = dataGetInvitationRank?.getLemonheadInvitationRank.items || [];
  const totalInvitations = dataGetInvitationRank?.getLemonheadInvitationRank.total || 0;

  const renderMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return <FirstMedal />;

      case 2:
        return <SecondMedal />;

      case 3:
        return <ThirdMedal />;

      default:
        return (
          <div className="flex justify-center items-center bg-(--btn-tertiary) rounded-full border aspect-square size-8">
            <p className="text-sm">{rank}</p>
          </div>
        );
    }
  };

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
              {renderMedal(myLemonheadRank?.rank || 0)}
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
            <Card.Header className="flex gap-4 bg-transparent">
              <p className="w-8 text-sm text-tertiary">Rank</p>
              <p className="flex-1 text-sm text-tertiary">Inviter</p>
              <p className="md:w-[96px] text-sm text-tertiary">Invites</p>
              <div className="hidden md:block w-[62px]" />
            </Card.Header>

            <AnimatePresence mode="wait">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }}>
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-center justify-center p-4 aspect-video text-tertiary"
                  >
                    <p>Loading...</p>
                  </motion.div>
                ) : (
                  <>
                    {!invitationRank.length && (
                      <div className="flex items-center justify-center p-4 aspect-video">
                        <p className="text-tertiary">No inviters found for this time range</p>
                      </div>
                    )}

                    {invitationRank.map((item, idx) => (
                      <Card.Content key={idx} className={clsx('py-3', idx % 2 === 0 && 'backdrop-blur-sm')}>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-4"
                        >
                          {renderMedal(item.rank)}
                          <div className="flex gap-3 items-center flex-1">
                            <img
                              src={userAvatar(item?.user as unknown as User)}
                              className="size-8 aspect-square rounded-full"
                            />
                            <p>{getUsernameOrWallet(item.user as LemonheadUserInfo)}</p>
                          </div>
                          <p className="md:w-[96px]">{item?.invitations_count}</p>
                          <div className="w-[62px] hidden md:block">
                            <Button variant="tertiary-alt" size="sm" className="rounded-full">
                              Follow
                            </Button>
                          </div>
                        </motion.div>
                      </Card.Content>
                    ))}
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

      <RightCol options={{ nft: false, invite: true, treasury: false }} />
    </div>
  );
}

export default Page;
