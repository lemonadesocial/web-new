'use client';

import { Avatar, Button, drawer } from '$lib/components/core';

import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { ProfilePane } from '../pane';

export function UserProfileCard() {
  const me = useMe();

  if (!me) return;

  return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <Avatar src={userAvatar(me)} className="size-14" />
      <div className="space-y-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-lg">{me.display_name}</p>
        </div>
      </div>
      <Button
        variant="tertiary"
        className="w-full"
        size="sm"
        onClick={() => drawer.open(ProfilePane, { dismissible: false })}
      >
        Edit Profile
      </Button>
    </div>
  );
}
