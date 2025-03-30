'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';

import { sessionAtom } from '$lib/jotai';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { useMe } from '$lib/hooks/useMe';
import { useLogOut } from '$lib/hooks/useLogout';

import { Avatar } from '$lib/components/core/avatar';
import { Button } from '$lib/components/core/button';
import { Divider, Menu, MenuItem } from '$lib/components/core';
import { userAvatar } from '$lib/utils/user';

export default function Header() {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const router = useRouter();
  const logOut = useLogOut();

  return (
    <div className="py-3 px-4 min-h-[56px] flex justify-between items-center">
      <Link href="/" aria-label="Lemonade" className="text-tertiary hover:text-primary">
        <i className="icon-lemonade size-[20]" />
      </Link>

      <div>
        {session && me ? (
          <Menu.Root>
            <Menu.Trigger>
              <Avatar src={userAvatar(me)} />
            </Menu.Trigger>
            <Menu.Content className="p-0 min-w-[228px]">
              {({ toggle }) => (
                <>
                  <div className="flex gap-2.5 px-2 py-1.5 items-center">
                    <Avatar size="lg" src={userAvatar(me)} />
                    <div>
                      <p className="text-md font-medium whitespace-nowrap">{me.name}</p>
                      <p className="text-xs font-medium text-tertiary">{me.email}</p>
                    </div>
                  </div>
                  <Divider />
                  <div className="p-1">
                    <Link href={`${LEMONADE_DOMAIN}/u/${me.username}`} target="_blank">
                      <MenuItem title="View Profile" />
                    </Link>
                    <Link href={`${LEMONADE_DOMAIN}/settings`} target="_blank">
                      <MenuItem title="Settings" />
                    </Link>
                    <MenuItem
                      title="Sign Out"
                      onClick={async () => {
                        toggle();
                        logOut();
                      }}
                    />
                  </div>
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        ) : (
          <>
            {!session && (
              <Button
                size="sm"
                variant="tertiary"
                onClick={() =>
                  router.replace(`http://identity.staging.lemonade.social/login?return_to=${window.location.href}`)
                }
              >
                Sign In
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
