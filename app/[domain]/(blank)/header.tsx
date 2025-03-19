'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { User } from '$lib/generated/backend/graphql';
import { Avatar } from '$lib/components/core/avatar';
import { Button } from '$lib/components/core/button';
import { Divider, Menu, MenuItem } from '$lib/components/core';
// import { logout } from './actions';

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
            <Menu.Content className="p-0">
              {({ toggle }) => (
                <>
                  <div className="flex gap-2.5 p-2.5 items-center">
                    <Avatar size="lg" src={me.image_avatar || ''} />
                    <div>
                      <p className="text-md font-medium">{me.name}</p>
                      <p className="text-xs font-medium text-tertiary/56">{me.email || 'johndoe@gmail.com'}</p>
                    </div>
                  </div>
                  <Divider />
                  <div className="p-2.5">
                    <MenuItem title="View Profile" />
                    <MenuItem title="Settings" />
                    <MenuItem
                      title="Sign Out"
                      onClick={async () => {
                        // await logout();
                        toggle();
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
