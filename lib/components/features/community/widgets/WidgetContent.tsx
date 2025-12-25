'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { twMerge } from 'tailwind-merge';
import { useSignIn } from '$lib/hooks/useSignIn';

import { Button, Card } from '$lib/components/core';
import { FollowSpaceDocument, Space, UnfollowSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';

interface Props extends React.PropsWithChildren {
  title: string;
  space: Space;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  canSubscribe?: boolean;
}

export function WidgetContent({ space, title, children, className, onClick, canSubscribe = true }: Props) {
  const [session] = useAtom(sessionAtom);
  const me = useMe();
  const signIn = useSignIn();

  const [follow, resFollow] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: true } });
    },
  });
  const [unfollow, resUnfollow] = useMutation(UnfollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: false } });
    },
  });

  const handleSubscribe = () => {
    if (!session) {
      // need to login to subscribe
      signIn();
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  return (
    <div className={twMerge('flex flex-col flex-1 items-center gap-2', className)}>
      <Card.Root data-card className="w-full h-full" onClick={onClick}>
        <Card.Content className="p-0">
          {canSubscribe && ![space?.creator, ...(space?.admins?.map((p) => p._id) || [])].includes(me?._id) && (
            <Button
              icon="icon-bell"
              variant="tertiary-alt"
              className="rounded-full absolute right-4 top-4"
              onClick={handleSubscribe}
            />
          )}

          {children}
        </Card.Content>
      </Card.Root>
      <p className="text-sm text-tertiary">{title}</p>
    </div>
  );
}
