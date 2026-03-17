'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import React from 'react';

import { Button, Card, Chip, Menu, MenuItem, modal } from '$lib/components/core';
import {
  ApiKeyBase,
  GetApiTierConfigDocument,
  ListApiKeysDocument,
  RevokeApiKeyDocument,
  Space,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { copy } from '$lib/utils/helpers';
import { CreateApiKeyModal } from '../modals/CreateApiKeyModal';
import { toast } from '$lib/components/core/toast';
import { EditApiKeyModal } from '../modals/EditApiKeyModal';
import { RegenerateApiKeyModal } from '../modals/RegenerateApiKeyModal';
import { ConfirmModal } from '../../modals/ConfirmModal';

export function SettingsCommunityDeveloper({ space }: { space: Space }) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const uid = space.slug || space._id;

  const { data: tierConfigData } = useQuery(GetApiTierConfigDocument, {
    variables: { space: space._id },
    skip: !space?._id,
  });
  const apiAccessEnabled = tierConfigData?.getApiTierConfig?.api_access_enabled;
  const availableScopes = tierConfigData?.getApiTierConfig?.available_scopes || [];

  const { data: apiKeysData, loading: apiKeysLoading, refetch: refetchApiKeys } = useQuery(ListApiKeysDocument, {
    variables: { space: space._id },
    skip: !space?._id || apiAccessEnabled !== true,
  });
  const apiKeys = apiKeysData?.listApiKeys || [];

  const [revokeApiKey] = useMutation(RevokeApiKeyDocument, {
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const openCreateModal = () =>
    modal.open(CreateApiKeyModal, {
      props: {
        spaceId: space._id,
        availableScopes,
        onCreated: async () => {
          await refetchApiKeys();
        },
      },
      className: 'overflow-visible',
    });

  const formatApiDate = (value?: string | null) => {
    if (!value) return 'Never';
    return format(new Date(value), 'MMM dd, yyyy');
  };

  const getStatusVariant = (status: string): 'success' | 'secondary' => {
    if (status === 'active') return 'success';
    return 'secondary';
  };

  const formatStatusLabel = (status: string) => `${status.charAt(0).toUpperCase()}${status.slice(1)}`;

  const openDeleteConfirmation = (apiKey: ApiKeyBase) => {
    modal.open(ConfirmModal, {
      props: {
        title: 'Delete Key?',
        subtitle: `This action cannot be undone. Any services or applications using the ${apiKey.name} key will no longer be able to access community data via the Lemonade API.`,
        icon: 'icon-delete',
        buttonText: 'Delete',
        onConfirm: async () => {
          await revokeApiKey({ variables: { id: apiKey._id } });
          toast.success('API key deleted.');
          await refetchApiKeys();
        },
      },
    });
  };

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-6">
      <section className="flex flex-col gap-5">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">API Keys</h3>
          <p className="text-secondary">
            Generate and manage API keys to connect Lemonade to your own tools and services.
          </p>
        </div>

        {apiAccessEnabled === false && (
          <Card.Root>
            <Card.Content className="flex items-center justify-between gap-3 py-3 px-4">
              <div className="flex items-center gap-3 min-w-0">
                <i aria-hidden="true" className="icon-key size-9 text-quaternary" />
                <div className="min-w-0">
                  <p className="text-tertiary">No API Keys</p>
                  <p className="text-sm text-tertiary">Upgrade to Lemonade Pro to create API keys.</p>
                </div>
              </div>

              <Link href={`/s/manage/${uid}/payments`}>
                <Button size="sm" variant="tertiary-alt" iconLeft="icon-flash" className="shrink-0">
                  Upgrade
                </Button>
              </Link>
            </Card.Content>
          </Card.Root>
        )}

        {apiAccessEnabled === true && !apiKeysLoading && apiKeys.length === 0 && (
          <Button variant="secondary" className="w-fit" onClick={openCreateModal}>
            Create API key
          </Button>
        )}

        {apiAccessEnabled === true && !apiKeysLoading && apiKeys.length > 0 && (
          <>
            <Card.Root className="overflow-visible">
              <div>
                <div className="min-w-[920px]">
                  <div className="flex gap-4 px-4">
                    <div className="flex-1 min-w-[220px] py-2">
                      <p className="text-sm text-tertiary">Name</p>
                    </div>
                    <div className="w-[160px] py-2">
                      <p className="text-sm text-tertiary">Scopes</p>
                    </div>
                    <div className="w-[216px] py-2">
                      <p className="text-sm text-tertiary">Key ID</p>
                    </div>
                    <div className="w-[120px] py-2">
                      <p className="text-sm text-tertiary">Created On</p>
                    </div>
                    <div className="w-[120px] py-2">
                      <p className="text-sm text-tertiary">Expires On</p>
                    </div>
                    <div className="w-[132px] py-2">
                      <p className="text-sm text-tertiary">Status</p>
                    </div>
                    <div className="w-5 py-2" />
                  </div>

                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey._id}
                      className={`flex gap-4 px-4 border-t border-(--color-divider) relative ${
                        openMenuId === apiKey._id ? 'z-30' : 'z-0'
                      }`}
                    >
                      <div className="flex-1 min-w-[220px] py-3">
                        <p className="text-md text-primary truncate">{apiKey.name}</p>
                      </div>

                      <div className="w-[160px] py-3">
                        <p className="text-md text-tertiary whitespace-pre-line">{apiKey.scopes.join('\n')}</p>
                      </div>

                      <div className="w-[216px] py-3">
                        <button
                          className="flex items-center gap-1 cursor-pointer"
                          onClick={() => {
                            copy(apiKey.key_prefix);
                            toast.success('Copied key ID.');
                          }}
                        >
                          <p className="text-md text-tertiary">{apiKey.key_prefix}</p>
                          <i aria-hidden="true" className="icon-copy size-4 text-tertiary" />
                        </button>
                      </div>

                      <div className="w-[120px] py-3">
                        <p className="text-md text-tertiary">{formatApiDate(apiKey.createdAt)}</p>
                      </div>

                      <div className="w-[120px] py-3">
                        <p className="text-md text-tertiary">{formatApiDate(apiKey.expires_at)}</p>
                      </div>

                      <div className="w-[132px] py-3">
                        <Chip size="xs" variant={getStatusVariant(apiKey.status)} className="inline-flex w-fit">
                          {formatStatusLabel(apiKey.status)}
                        </Chip>
                      </div>

                      <div className="w-5 py-3 flex items-start">
                        <Menu.Root
                          placement="bottom-end"
                          strategy="fixed"
                          isOpen={openMenuId === apiKey._id}
                          onOpenChange={(open) => setOpenMenuId(open ? apiKey._id : null)}
                        >
                          <Menu.Trigger>
                            <button className="cursor-pointer">
                              <i aria-hidden="true" className="icon-more-horiz size-5 text-tertiary" />
                            </button>
                          </Menu.Trigger>
                          <Menu.Content className="p-1 w-[180px] bg-overlay-primary backdrop-blur-none!">
                            {({ toggle }) => (
                              <>
                                <MenuItem
                                  onClick={() => {
                                    toggle();
                                    modal.open(EditApiKeyModal, {
                                      props: {
                                        apiKey,
                                        availableScopes,
                                        onUpdated: async () => {
                                          await refetchApiKeys();
                                        },
                                      },
                                      className: 'overflow-visible',
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <i aria-hidden="true" className="icon-edit-sharp size-4 text-primary" />
                                    <p className="text-sm text-primary">Edit Key</p>
                                  </div>
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    toggle();
                                    modal.open(RegenerateApiKeyModal, {
                                      props: {
                                        apiKey,
                                        onRegenerated: async () => {
                                          await refetchApiKeys();
                                        },
                                      },
                                      className: 'overflow-visible',
                                    });
                                  }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <i aria-hidden="true" className="icon-renew size-4 text-primary" />
                                    <p className="text-sm text-primary">Regenerate Key</p>
                                  </div>
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    toggle();
                                    openDeleteConfirmation(apiKey);
                                  }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <i aria-hidden="true" className="icon-delete size-4 text-error" />
                                    <p className="text-sm text-error">Delete Key</p>
                                  </div>
                                </MenuItem>
                              </>
                            )}
                          </Menu.Content>
                        </Menu.Root>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Root>

            <Button variant="secondary" className="w-fit" onClick={openCreateModal}>
              Create API Key
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
