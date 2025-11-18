'use client';

import { Button, toast } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useMutation } from '$lib/graphql/request';
import { CreateOauth2ClientDocument } from '$lib/graphql/generated/backend/graphql';

import { ListItem } from './list-item';
import { useState } from 'react';

export function OAuthClient() {
  const me = useMe();
  const [clientId, setClientId] = useState<string>();

  const [createOauth2, { loading }] = useMutation(CreateOauth2ClientDocument);

  const createOauth2Client = async () => {
    const { data } = await createOauth2({
      variables: {
        input: {
          client_name: 'Test Client',
        },
      },
    });

    if (data?.createOauth2Client) {
      //-- save data as text file
      const text = [
        `Client ID: ${data.createOauth2Client.client_id}`,
        `Client Secret: ${data.createOauth2Client.client_secret}`,
        ...(data.createOauth2Client.audience[0] ? [`Audience: ${data.createOauth2Client.audience[0]}`] : []),
      ].join('\n');

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'oauth2-client.txt';
      a.click();

      setClientId(data?.createOauth2Client?.client_id);

      //-- toast success
      toast.success('OAuth2 client generated.');
    } else {
      toast.error('Failed to generate OAuth2 client.');
    }
  };

  if (!me) return null;

  const currentOauth2Client = clientId || me.oauth2_clients?.[0];

  return (
    <div>
      <ListItem icon="icon-factory" title="OAuth2 client" subtile={currentOauth2Client || 'No Oauth2 client'}>
        {!currentOauth2Client && (
          <Button loading={loading} onClick={createOauth2Client} size="sm" variant="secondary">
            Generate OAuth2 client
          </Button>
        )}
      </ListItem>
    </div>
  );
}
