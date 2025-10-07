'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { Button, toast } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { copy } from '$lib/utils/helpers';
import { useUserProfile } from '$lib/hooks/useUserProfile';

import { UserProfileHero } from '../users-profile/UserProfileHero';
import { UserProfileInfo } from '../users-profile/UserProfileInfo';
import { UserProfileTabs } from '../users-profile/UserProfileTabs';

interface Props {
  /** localName lens account */
  username?: string;
  /** lens account address */
  address: string;
}

export function UserProfilePane({ username, address }: Props) {
  const router = useRouter();
  const { loading, user } = useUserProfile({ username, address });

  if (loading) return null;

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              iconLeft="icon-copy"
              variant="tertiary-alt"
              onClick={() => copy(`${LEMONADE_DOMAIN}/u/${username || address}`, () => toast.success('Url Copied!'))}
            >
              Copy Link
            </Button>
            <Button
              size="sm"
              variant="tertiary-alt"
              iconRight="icon-arrow-outward"
              onClick={() => router.push(`${LEMONADE_DOMAIN}/u/${username || address}`)}
            >
              Profile Page
            </Button>
          </div>
        </Pane.Header.Left>
      </Pane.Header.Root>

      <Pane.Content className="py-4 w-full">
        <div className="px-4">
          <UserProfileHero address={address} containerClass="md:hidden h-[140px]! [&>.user-dp]:size-18" user={user} />
          <UserProfileHero
            address={address}
            containerClass="hidden md:block h-[200px]! [&>.user-dp]:size-24"
            user={user}
          />
          <UserProfileInfo user={user} />
        </div>

        <UserProfileTabs user={user} address={address} containerClass="px-4" contentClass="p-4" />
      </Pane.Content>
    </Pane.Root>
  );
}
