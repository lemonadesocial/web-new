'use client';
import React from 'react';

import { User } from '$lib/generated/graphql';
import { Avatar } from '$lib/components/core/avatar';
import { Button } from '$lib/components/core/button';
import { useRouter } from 'next/navigation';

export default function Header({ me }: { me: User }) {
  const router = useRouter();

  return (
    <div className="p-4 flex justify-between items-center">
      <i className="icon-lemonade size-[20]" />

      <div>
        {me ? (
          <Avatar src={me.image_avatar || ''} name={me.name} />
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
