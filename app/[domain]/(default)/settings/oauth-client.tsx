'use client';
import { useState } from 'react';
import _ from 'lodash';
import { Button, Input, toast } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  CreateOauth2ClientDocument,
  ListOauth2ClientsDocument,
  UpdateOauth2ClientDocument,
} from '$lib/graphql/generated/backend/graphql';

import { ListItem } from './list-item';

let keyCounter = 0;
const generateKey = () => `url-${++keyCounter}`;

export function OAuthClient() {
  const me = useMe();
  const [clientId, setClientId] = useState<string>();

  const currentOauth2Client = clientId || me?.oauth2_clients?.[0];

  const [edit, setEdit] = useState(false);
  const [editUrls, setEditUrls] = useState<{ key: string; url: string }[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [createOauth2, { loading: creating }] = useMutation(CreateOauth2ClientDocument);
  const [updateOauth2, { loading: updating }] = useMutation(UpdateOauth2ClientDocument);
  const { data: clients, refetch } = useQuery(ListOauth2ClientsDocument, {
    variables: { ids: [currentOauth2Client!] },
    skip: !currentOauth2Client,
  });

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

  const clientDetails = !!currentOauth2Client
    ? clients?.listOauth2Clients.find((c) => c.client_id === currentOauth2Client)
    : undefined;

  const renderUrls = edit
    ? editUrls
    : (clientDetails?.redirect_uris || []).map((url, index) => ({ key: index.toString(), url }));

  if (!me) return null;

  return (
    <div>
      <ListItem icon="icon-factory" title="OAuth2 client" subtile={currentOauth2Client || 'No Oauth2 client'}>
        {!currentOauth2Client && (
          <Button loading={creating} onClick={createOauth2Client} size="sm" variant="secondary">
            Generate OAuth2 client
          </Button>
        )}
      </ListItem>
      {clientDetails && (
        <ListItem icon="icon-repost" title="Redirect URLs" subtile="" flexColumn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {!edit && !renderUrls.length ? (
                <div>No redirect URL</div>
              ) : (
                renderUrls.map(({ key, url }, index) => (
                  <div key={key}>
                    {edit ? (
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                        <Input
                          readOnly={updating}
                          value={url}
                          onChange={(e) =>
                            setEditUrls((urls) => [
                              ...urls.slice(0, index),
                              { key, url: e.target.value },
                              ...urls.slice(index + 1),
                            ])
                          }
                        />
                        <Button
                          disabled={updating}
                          onClick={() => {
                            setEditUrls((urls) => [...urls.slice(0, index), ...urls.slice(index + 1)]);
                          }}
                          icon="icon-delete"
                          variant="danger"
                        />
                      </div>
                    ) : (
                      <div>{url}</div>
                    )}
                  </div>
                ))
              )}
              {edit && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                  <Input placeholder="Add new URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                  <Button
                    disabled={updating || !newUrl.trim()}
                    onClick={() => {
                      setEditUrls((urls) => [...urls, { key: generateKey(), url: newUrl.trim() }]);
                      setNewUrl('');
                    }}
                    icon="icon-plus"
                    variant="secondary"
                  />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {edit ? (
                <>
                  <Button
                    disabled={updating}
                    onClick={() => {
                      setEdit(false);
                      setNewUrl('');
                    }}
                    size="sm"
                    variant="tertiary"
                  >
                    Cancel
                  </Button>
                  <Button
                    loading={updating}
                    onClick={() => {
                      if (!currentOauth2Client) {
                        return;
                      }

                      setNewUrl('');
                      const redirectUris = _.uniq(editUrls.map(({ url }) => url.trim()).filter(Boolean));

                      updateOauth2({
                        variables: {
                          updateOauth2ClientId: currentOauth2Client,
                          input: { redirect_uris: redirectUris },
                        },
                      })
                        .then(refetch)
                        .then(() => setEdit(false));
                    }}
                    size="sm"
                    variant="primary"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEditUrls([...renderUrls]);
                      setEdit(true);
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </ListItem>
      )}
    </div>
  );
}
