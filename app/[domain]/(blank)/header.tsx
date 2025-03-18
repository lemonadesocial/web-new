'use client';
import React from 'react';

import { User } from '$lib/generated/backend/graphql';
import { Avatar } from '$lib/components/core/avatar';
import { Button } from '$lib/components/core/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, MenuItem } from '$lib/components/core';

export default function Header({ me }: { me: User }) {
  const router = useRouter();

  return (
    <div className="p-4 flex justify-between items-center">
      <Link href="/" aria-label="Lemonade">
        <i className="icon-lemonade size-[20]" />
      </Link>

      <div>
        {me ? (
          <Menu className="w-fit right-0">
            <Menu.Trigger>
              <Avatar src={me.image_avatar || ''} />
            </Menu.Trigger>
            <Menu.Content>
              <MenuItem iconLeft="icon-" title="logout" />
            </Menu.Content>
          </Menu>
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
