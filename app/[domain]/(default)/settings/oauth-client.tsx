'use client';
import { useState } from 'react';
import _ from 'lodash';
import { Button, Card, Input, modal, toast } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  DeleteOauth2ClientDocument,
  ListOauth2ClientsDocument,
  UpdateOauth2ClientDocument,
} from '$lib/graphql/generated/backend/graphql';
import { ConfirmModal } from '$lib/components/features/modals/ConfirmModal';

import { ListItem } from './list-item';
import { CreateOauth2ClientModal } from '$lib/components/features/modals/CreateOauth2ClientModal';

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

  const { data: clients, loading: loadingClients, refetch } = useQuery(ListOauth2ClientsDocument);

  const clientList = clients?.listOauth2Clients || [];
  const canCreateMore = !me?.oauth2_max_clients || me.oauth2_max_clients > clientList.length;

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

          {!loadingClients && !clientList.length && (
            <div className="flex items-center gap-4 text-tertiary">
              <i className="icon-manage-accounts-outline size-5 aspect-square" />
              <div className="space-y-1">
                <p>No OAuth2 Clients</p>
                <p className="text-sm">Allow third-party apps to authenticate users via Lemonade.</p>
              </div>
            </div>
          )}
        </Card.Content>
      </Card.Root>

      {canCreateMore && (
        <div>
          <Button
            onClick={() => modal.open(CreateOauth2ClientModal, { props: { onRefetch: refetch } })}
            variant="secondary"
            iconLeft="icon-plus"
            className="bg-white text-black hover:bg-white/90 border-none px-4 py-2.5 h-auto rounded-xl font-semibold"
          >
            New Client
          </Button>
        </div>
      )}
    </div>
  );
}
