'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { logout } from '$app/actions/auth';

import { User } from '$lib/generated/backend/graphql';
import { Avatar } from '$lib/components/core/avatar';
import { Button } from '$lib/components/core/button';
import { Divider, Menu, MenuItem } from '$lib/components/core';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';

export default function Header({ me }: { me: User }) {
  const router = useRouter();

  return (
    <div className="p-4 flex justify-between items-center">
      <Link href="/" aria-label="Lemonade">
        <i className="icon-lemonade size-[20]" />
      </Link>

      <div>
        {me ? (
          <Menu.Root>
            <Menu.Trigger>
              <Avatar src={me.image_avatar || ''} />
            </Menu.Trigger>
            <Menu.Content className="p-0 min-w-[228px]">
              {({ toggle }) => (
                <>
                  <div className="flex gap-2.5 px-2 py-1.5 items-center">
                    <Avatar size="lg" src={me.image_avatar || ''} />
                    <div>
                      <p className="text-md font-medium">{me.name}</p>
                      <p className="text-xs font-medium text-tertiary/56">{me.email}</p>
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
                        await logout();
                        window.location.reload();
                      }}
                    />
                  </div>
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        ) : (
          <>
            <Button
              size="sm"
              variant="tertiary"
              onClick={() =>
                router.replace(`http://identity.staging.lemonade.social/login?return_to=${window.location.href}`)
              }
            >
              Sign In
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
