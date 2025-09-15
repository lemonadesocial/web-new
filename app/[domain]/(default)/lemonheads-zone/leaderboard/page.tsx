'use client';
import React from 'react';
import clsx from 'clsx';

import { Badge, Button, Card, modal } from '$lib/components/core';
import {
  GetLemonheadInvitationRankDocument,
  GetMyLemonheadInvitationRankDocument,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { userAvatar } from '$lib/utils/user';
import { InviteFriendModal, LockFeature, RightCol } from '../shared';

function Page() {
  const { data } = useLemonhead();
  const [skip, setSkip] = React.useState(0);

  const { data: dataGetMyRank } = useQuery(GetMyLemonheadInvitationRankDocument);
  const myLemonheadRank = dataGetMyRank?.getMyLemonheadInvitationRank;

  const { data: dataGetInvitationRank } = useQuery(GetLemonheadInvitationRankDocument, {
    variables: { skip, limit: 25 },
  });
  const invitationRank = dataGetInvitationRank?.getLemonheadInvitationRank.items || [];

  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-4 w-full">
        {/* <LockFeature */}
        {/*   title={'Proposals are Locked'} */}
        {/*   subtitle={ */}
        {/*     data && data?.tokenId > 0 */}
        {/*       ? 'Unlocks at 5,000 LemonHeads to support community requests.' */}
        {/*       : 'Claim your LemonHead to unlock proposals & get support for your projects.' */}
        {/*   } */}
        {/*   icon="icon-lab-profile" */}
        {/* /> */}

        <Card.Root>
          <Card.Content className="flex gap-4 py-3 items-center">
            <div className="flex justify-center items-center bg-(--btn-tertiary) rounded-full border aspect-square size-8">
              {myLemonheadRank?.rank}
            </div>
            <div className="flex gap-3 items-center flex-1">
              <img
                src={userAvatar(myLemonheadRank?.user as unknown as User)}
                className="size-8 aspect-square rounded-full"
              />
              <p>{myLemonheadRank?.user?.username}</p>
              <Badge title="Your Rank" color="var(--color-tertiary)" className="rounded-full" />
            </div>
            <p className="w-[96px]">{myLemonheadRank?.invitations_count}</p>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full"
              onClick={() => modal.open(InviteFriendModal)}
            >
              Invite
            </Button>
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header className="flex gap-4 bg-transparent">
            <p className="w-8 text-sm text-tertiary">Rank</p>
            <p className="flex-1 text-sm text-tertiary">Inviter</p>
            <p className="w-[96px] text-sm text-tertiary">Invites</p>
            <div className="w-[62px]" />
          </Card.Header>

          {invitationRank.map((item, idx) => (
            <Card.Content key={idx} className={clsx('flex gap-4 py-3 items-center')}>
              <div className="flex justify-center items-center bg-(--btn-tertiary) rounded-full border aspect-square size-8">
                {item?.rank}
              </div>
              <div className="flex gap-3 items-center flex-1">
                <img src={userAvatar(item?.user as unknown as User)} className="size-8 aspect-square rounded-full" />
                <p>{item?.user?.username}</p>
              </div>
              <p className="w-[96px]">{item?.invitations_count}</p>
              <Button variant="tertiary-alt" size="sm" className="rounded-full">
                Follow
              </Button>
            </Card.Content>
          ))}
        </Card.Root>
      </div>

      <RightCol options={{ nft: false, invite: true, treasury: false }} />
    </div>
  );
}

export default Page;
