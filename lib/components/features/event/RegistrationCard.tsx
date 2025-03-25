import { Avatar, Button, Card } from '$lib/components/core';
import { GetMeDocument, User } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { generateUrl } from '$lib/utils/cnd';
import React from 'react';

export default function RegistrationCard() {
  const { data } = useQuery(GetMeDocument);
  const me = data?.getMe as User;

  return (
    <Card.Root>
      <Card.Header title="Registration" />
      <Card.Content className="flex flex-col gap-4 font-medium">
        <p>Welcome! To join the event, please register below.</p>
        {me && (
          <div className="flex gap-2 items-center">
            <Avatar src={generateUrl(me.image_avatar)} size="sm" />
            <div className="flex gap-1 items-center">
              {me.name && <p>{me.name}</p>}
              {me.email && <p>{me.email}</p>}
            </div>
          </div>
        )}
        <Button variant="secondary">One-Click Register</Button>
      </Card.Content>
    </Card.Root>
  );
}
