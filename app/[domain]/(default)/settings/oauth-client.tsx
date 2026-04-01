'use client';
import { useState } from 'react';
import _ from 'lodash';
import { Button, Card, Input, modal, toast } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  CreateOauth2ClientDocument,
  DeleteOauth2ClientDocument,
  ListOauth2ClientsDocument,
  UpdateOauth2ClientDocument,
} from '$lib/graphql/generated/backend/graphql';
import { ConfirmModal } from '$lib/components/features/modals/ConfirmModal';

import { ListItem } from './list-item';

let keyCounter = 0;
const generateKey = () => `url-${++keyCounter}`;

function OAuthClientCard({
  client,
  onRefetch,
  isLast,
}: {
  client: { client_id: string; client_name: string; redirect_uris?: string[] | null };
  onRefetch: () => void;
  isLast?: boolean;
}) {
  const [edit, setEdit] = useState(false);
  const [editUrls, setEditUrls] = useState<{ key: string; url: string }[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [updateOauth2, { loading: updating }] = useMutation(UpdateOauth2ClientDocument);
  const [deleteOauth2] = useMutation(DeleteOauth2ClientDocument);

  const renderUrls = edit
    ? editUrls
    : (client.redirect_uris || []).map((url, index) => ({ key: index.toString(), url }));

  const handleDelete = () => {
    modal.open(ConfirmModal, {
      props: {
        title: 'Delete OAuth2 Client',
        subtitle: `Are you sure you want to delete client "${client.client_name || client.client_id}"? This action cannot be undone.`,
        icon: 'icon-delete',
        onConfirm: async () => {
          const { data } = await deleteOauth2({
            variables: { deleteOauth2ClientId: client.client_id },
          });
          if (data?.deleteOauth2Client) {
            toast.success('OAuth2 client deleted.');
            onRefetch();
          } else {
            toast.error('Failed to delete OAuth2 client.');
          }
        },
        buttonText: 'Delete',
      },
    });
  };

  return (
    <>
      <ListItem
        icon="icon-api"
        title="OAuth2 client"
        subtile={client.client_name ? `${client.client_name} — ${client.client_id}` : client.client_id}
      >
        <Button onClick={handleDelete} size="sm" variant="danger" icon="icon-delete" />
      </ListItem>
      <ListItem icon="icon-repost" title="Redirect URLs" subtile="" flexColumn divide={!isLast}>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-1.5">
            {!edit && !renderUrls.length ? (
              <div className="text-tertiary text-sm">No redirect URL</div>
            ) : (
              renderUrls.map(({ key, url }, index) => (
                <div key={key}>
                  {edit ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        readOnly={updating}
                        value={url}
                        className="flex-1"
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
                    <div className="text-primary text-sm break-all">{url}</div>
                  )}
                </div>
              ))
            )}
            {edit && (
              <div className="flex items-center gap-1.5">
                <Input
                  placeholder="Add new URL"
                  value={newUrl}
                  className="flex-1"
                  onChange={(e) => setNewUrl(e.target.value)}
                />
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
          <div className="flex items-center gap-2">
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
                    setNewUrl('');
                    const redirectUris = _.uniq(editUrls.map(({ url }) => url.trim()).filter(Boolean));

                    updateOauth2({
                      variables: {
                        updateOauth2ClientId: client.client_id,
                        input: { redirect_uris: redirectUris },
                      },
                    }).then(() => {
                      setEdit(false);
                      onRefetch();
                    });
                  }}
                  size="sm"
                  variant="primary"
                >
                  Save
                </Button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </ListItem>
    </>
  );
}

export function OAuthClient() {
  const me = useMe();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clientName, setClientName] = useState('');

  const { data: clients, loading: loadingClients, refetch } = useQuery(ListOauth2ClientsDocument);

  const [createOauth2, { loading: creating }] = useMutation(CreateOauth2ClientDocument);

  const clientList = clients?.listOauth2Clients || [];
  const canCreateMore = !me?.oauth2_max_clients || me.oauth2_max_clients > clientList.length;

  const createOauth2Client = async () => {
    const { data } = await createOauth2({
      variables: {
        input: {
          client_name: clientName.trim() || undefined,
        },
      },
    });

    if (data?.createOauth2Client) {
      const text = [
        `Client ID: ${data.createOauth2Client.client_id}`,
        `Client Secret: ${data.createOauth2Client.client_secret}`,
        ...(data.createOauth2Client.audience[0] ? [`Audience: ${data.createOauth2Client.audience[0]}`] : []),
      ].join('\n');

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `oauth2-client-${data.createOauth2Client.client_id}.txt`;
      a.click();

      setClientName('');
      setShowCreateForm(false);
      toast.success('OAuth2 client created.');
      refetch();
    } else {
      toast.error('Failed to create OAuth2 client.');
    }
  };

  if (!me) return null;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xl font-semibold text-primary">OAuth2 Clients</p>

      <Card.Root>
        <Card.Content className="py-3">
          {clientList.map((client, index) => (
            <OAuthClientCard
              key={client.client_id}
              client={client}
              onRefetch={refetch}
              isLast={index === clientList.length - 1}
            />
          ))}

          {!loadingClients && !clientList.length && !showCreateForm && (
            <div className="flex items-center gap-4 text-tertiary">
              <i className="icon-manage-accounts-outline size-5 aspect-square" />
              <div className="space-y-1">
                <p>No OAuth2 Clients</p>
                <p className="text-sm">Allow third-party apps to authenticate users via Lemonade.</p>
              </div>
            </div>
          )}

          {showCreateForm && (
            <div className="p-4 flex flex-col gap-3">
              <p className="text-sm text-tertiary">Create new OAuth2 client</p>
              <Input
                placeholder="Client name (optional)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setClientName('');
                  }}
                  size="sm"
                  variant="tertiary"
                >
                  Cancel
                </Button>
                <Button loading={creating} onClick={createOauth2Client} size="sm" variant="primary">
                  Create
                </Button>
              </div>
            </div>
          )}
        </Card.Content>
      </Card.Root>

      {!showCreateForm && canCreateMore && (
        <div>
          <Button onClick={() => setShowCreateForm(true)} variant="secondary" iconLeft="icon-plus">
            New Client
          </Button>
        </div>
      )}
    </div>
  );
}
