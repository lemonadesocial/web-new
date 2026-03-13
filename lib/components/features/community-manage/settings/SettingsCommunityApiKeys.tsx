'use client';

import React from 'react';
import { Button, Card, Divider, InputField, Checkbox, modal, toast } from '$lib/components/core';
import { Chip } from '$lib/components/core/chip/Chip';
import { Progress } from '$lib/components/core/progess';
import { useMutation, useQuery } from '$lib/graphql/request';
import { ConfirmModal } from '../../modals/ConfirmModal';

// TODO: These imports will resolve after running `yarn codegen`
import type { Space } from '$lib/graphql/generated/backend/graphql';
import {
  ListApiKeysDocument,
  CreateApiKeyDocument,
  UpdateApiKeyDocument,
  RevokeApiKeyDocument,
  RotateApiKeyDocument,
  GetApiQuotaStatusDocument,
  GetApiTierConfigDocument,
  GetApiKeyUsageDocument,
} from '$lib/graphql/generated/backend/graphql';

// TODO: Replace with generated types after codegen
type ApiKey = any;
type ApiTierConfig = any;
type ApiQuotaStatus = any;
type ApiKeyUsage = any;

export function SettingsCommunityApiKeys(props: { space: Space }) {
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [createdSecret, setCreatedSecret] = React.useState<string | null>(null);
  const [editingKey, setEditingKey] = React.useState<ApiKey | null>(null);
  const [expandedKeyId, setExpandedKeyId] = React.useState<string | null>(null);

  // --- A. Tier Gate Check ---
  const { data: tierData, loading: tierLoading } = useQuery(GetApiTierConfigDocument, {
    variables: { space: props.space._id },
    skip: !props.space?._id,
  });

  const tierConfig: ApiTierConfig = tierData?.getApiTierConfig;

  if (tierLoading) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
        <div className="flex items-center justify-center py-12">
          <i aria-hidden="true" className="icon-loader size-6 text-tertiary animate-spin" />
        </div>
      </div>
    );
  }

  if (!tierConfig?.api_access_enabled) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
        <Card.Root>
          <Card.Content className="flex flex-col gap-4 items-center text-center py-8">
            <div className="p-3 rounded-full bg-warning-400/16 size-[56px] aspect-square flex items-center justify-center">
              <i aria-hidden="true" className="icon-lock text-warning-400 size-8" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium">API Access Requires a Paid Plan</p>
              <p className="text-sm text-secondary max-w-md">
                API access requires a paid subscription. Upgrade your plan to create API keys.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const baseUrl = `/s/manage/${props.space.slug || props.space._id}/settings`;
                window.location.href = `${baseUrl}?tab=subscription`;
              }}
            >
              Upgrade Plan
            </Button>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  return (
    <SettingsCommunityApiKeysContent
      space={props.space}
      tierConfig={tierConfig}
      showCreateForm={showCreateForm}
      setShowCreateForm={setShowCreateForm}
      createdSecret={createdSecret}
      setCreatedSecret={setCreatedSecret}
      editingKey={editingKey}
      setEditingKey={setEditingKey}
      expandedKeyId={expandedKeyId}
      setExpandedKeyId={setExpandedKeyId}
    />
  );
}

function SettingsCommunityApiKeysContent({
  space,
  tierConfig,
  showCreateForm,
  setShowCreateForm,
  createdSecret,
  setCreatedSecret,
  editingKey,
  setEditingKey,
  expandedKeyId,
  setExpandedKeyId,
}: {
  space: Space;
  tierConfig: ApiTierConfig;
  showCreateForm: boolean;
  setShowCreateForm: (v: boolean) => void;
  createdSecret: string | null;
  setCreatedSecret: (v: string | null) => void;
  editingKey: ApiKey | null;
  setEditingKey: (v: ApiKey | null) => void;
  expandedKeyId: string | null;
  setExpandedKeyId: (v: string | null) => void;
}) {
  // --- B. API Keys List ---
  const { data: keysData, loading: keysLoading, refetch: refetchKeys } = useQuery(ListApiKeysDocument, {
    variables: { space: space._id },
    skip: !space?._id,
  });

  const apiKeys: ApiKey[] = keysData?.listApiKeys ?? [];
  const activeKeys = apiKeys.filter((k: ApiKey) => k.status === 'active');
  const canCreateMore = activeKeys.length < (tierConfig?.max_api_keys ?? Infinity);

  // --- G. Quota Status ---
  const { data: quotaData } = useQuery(GetApiQuotaStatusDocument, {
    variables: { space: space._id },
    skip: !space?._id,
  });

  const quota: ApiQuotaStatus = quotaData?.getApiQuotaStatus;

  // --- Mutations ---
  const [createApiKey, { loading: creating }] = useMutation(CreateApiKeyDocument, {
    onComplete: (_client, data) => {
      const secret = data?.createApiKey?.secret;
      if (secret) {
        setCreatedSecret(secret);
      }
      toast.success('API key created.');
      setShowCreateForm(false);
      refetchKeys();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateApiKey] = useMutation(UpdateApiKeyDocument, {
    onComplete: () => {
      toast.success('API key updated.');
      setEditingKey(null);
      refetchKeys();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [rotateApiKey] = useMutation(RotateApiKeyDocument, {
    onComplete: (_client, data) => {
      const secret = data?.rotateApiKey?.secret;
      if (secret) {
        setCreatedSecret(secret);
      }
      toast.success('API key rotated.');
      refetchKeys();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [revokeApiKey] = useMutation(RevokeApiKeyDocument, {
    onComplete: () => {
      toast.success('API key revoked.');
      refetchKeys();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      {/* Secret Display (after create or rotate) */}
      {createdSecret && (
        <SecretDisplay secret={createdSecret} onDismiss={() => setCreatedSecret(null)} />
      )}

      {/* API Keys Section */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">API Keys</h3>
            <p className="text-secondary">Manage API keys for programmatic access to your community.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            iconLeft="icon-add"
            disabled={!canCreateMore}
            onClick={() => setShowCreateForm(true)}
          >
            Create API Key
          </Button>
        </div>

        {!canCreateMore && (
          <p className="text-sm text-warning-400">
            You have reached the maximum number of API keys ({tierConfig?.max_api_keys}). Revoke an existing key to create a new one.
          </p>
        )}

        {showCreateForm && (
          <CreateApiKeyForm
            availableScopes={tierConfig?.available_scopes ?? []}
            creating={creating}
            onSubmit={(input) => {
              createApiKey({
                variables: {
                  input: { ...input, space: space._id },
                },
              });
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {keysLoading ? (
          <div className="flex items-center justify-center py-8">
            <i aria-hidden="true" className="icon-loader size-5 text-tertiary animate-spin" />
          </div>
        ) : activeKeys.length === 0 && !showCreateForm ? (
          <Card.Root>
            <Card.Content className="flex flex-col items-center text-center py-8 gap-2">
              <p className="text-tertiary">No API keys yet.</p>
              <p className="text-sm text-tertiary">Create an API key to get started with programmatic access.</p>
            </Card.Content>
          </Card.Root>
        ) : (
          <Card.Root>
            <Card.Content className="p-0 divide-y divide-(--color-divider)">
              {activeKeys.map((key: ApiKey) => (
                <ApiKeyRow
                  key={key._id}
                  apiKey={key}
                  isExpanded={expandedKeyId === key._id}
                  onToggleExpand={() => setExpandedKeyId(expandedKeyId === key._id ? null : key._id)}
                  editingKey={editingKey}
                  setEditingKey={setEditingKey}
                  availableScopes={tierConfig?.available_scopes ?? []}
                  onEdit={(input) => {
                    updateApiKey({
                      variables: { id: key._id, input },
                    });
                  }}
                  onRotate={() => {
                    modal.open(ConfirmModal, {
                      props: {
                        title: 'Rotate API Key?',
                        subtitle: 'Rotating will invalidate the current key immediately. Any integrations using this key will stop working. Continue?',
                        icon: 'icon-refresh',
                        buttonText: 'Rotate',
                        onConfirm: async () => {
                          await rotateApiKey({
                            variables: { id: key._id },
                          });
                        },
                      },
                    });
                  }}
                  onRevoke={() => {
                    modal.open(ConfirmModal, {
                      props: {
                        title: 'Revoke API Key?',
                        subtitle: 'This will permanently revoke the key. This cannot be undone.',
                        icon: 'icon-delete',
                        buttonText: 'Revoke',
                        onConfirm: async () => {
                          await revokeApiKey({
                            variables: { id: key._id },
                          });
                        },
                      },
                    });
                  }}
                />
              ))}
            </Card.Content>
          </Card.Root>
        )}
      </div>

      <Divider />

      {/* G. Quota Status Card */}
      {quota && <QuotaStatusCard quota={quota} />}
    </div>
  );
}

// --- Secret Display Component ---
function SecretDisplay({ secret, onDismiss }: { secret: string; onDismiss: () => void }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success('API key copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy. Please copy manually.');
    }
  };

  return (
    <Card.Root className="border-success-400/30 bg-success-400/5">
      <Card.Content className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <i aria-hidden="true" className="icon-key text-success-400 size-5" />
          <p className="text-lg font-medium">Your New API Key</p>
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 bg-overlay-primary rounded px-3 py-2 font-mono text-sm break-all select-all">
            {secret}
          </code>
          <Button
            variant="tertiary-alt"
            size="sm"
            icon={copied ? 'icon-check' : 'icon-copy'}
            onClick={handleCopy}
          />
        </div>

        <div className="flex items-center gap-2 text-warning-400">
          <i aria-hidden="true" className="icon-warning size-4" />
          <p className="text-sm font-medium">Save this key now. You won't be able to see it again.</p>
        </div>

        <Button variant="secondary" size="sm" className="w-fit" onClick={onDismiss}>
          Done
        </Button>
      </Card.Content>
    </Card.Root>
  );
}

// --- Create API Key Form ---
function CreateApiKeyForm({
  availableScopes,
  creating,
  onSubmit,
  onCancel,
}: {
  availableScopes: string[];
  creating: boolean;
  onSubmit: (input: { name: string; scopes: string[]; expires_at?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = React.useState('');
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([]);
  const [expiresAt, setExpiresAt] = React.useState('');

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Name is required.');
      return;
    }
    onSubmit({
      name: name.trim(),
      scopes: selectedScopes,
      ...(expiresAt ? { expires_at: expiresAt } : {}),
    });
  };

  return (
    <Card.Root>
      <Card.Content className="flex flex-col gap-4">
        <p className="text-lg font-medium">Create New API Key</p>

        <InputField
          label="Name"
          placeholder="e.g. Production Backend"
          value={name}
          onChangeText={setName}
        />

        {availableScopes.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Scopes</p>
            <div className="flex flex-col gap-2">
              {availableScopes.map((scope) => (
                <Checkbox
                  key={scope}
                  id={`scope-${scope}`}
                  value={selectedScopes.includes(scope)}
                  onChange={() => toggleScope(scope)}
                >
                  <span className="text-sm font-mono">{scope}</span>
                </Checkbox>
              ))}
            </div>
          </div>
        )}

        <InputField
          label="Expiration Date (optional)"
          type="date"
          value={expiresAt}
          onChangeText={setExpiresAt}
        />

        <div className="flex gap-3">
          <Button variant="tertiary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" loading={creating} onClick={handleSubmit}>
            Create Key
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

// --- API Key Row ---
function ApiKeyRow({
  apiKey,
  isExpanded,
  onToggleExpand,
  editingKey,
  setEditingKey,
  availableScopes,
  onEdit,
  onRotate,
  onRevoke,
}: {
  apiKey: ApiKey;
  isExpanded: boolean;
  onToggleExpand: () => void;
  editingKey: ApiKey | null;
  setEditingKey: (v: ApiKey | null) => void;
  availableScopes: string[];
  onEdit: (input: { name?: string; scopes?: string[] }) => void;
  onRotate: () => void;
  onRevoke: () => void;
}) {
  const isEditing = editingKey?._id === apiKey._id;
  const [editName, setEditName] = React.useState(apiKey.name || '');
  const [editScopes, setEditScopes] = React.useState<string[]>(apiKey.scopes || []);

  // Usage data — only fetched on expand (not for all keys at once)
  const { data: usageData } = useQuery(GetApiKeyUsageDocument, {
    variables: { id: apiKey._id },
    skip: !isExpanded,
  });

  const usage: ApiKeyUsage = usageData?.getApiKeyUsage;

  const handleSaveEdit = () => {
    onEdit({
      name: editName.trim(),
      scopes: editScopes,
    });
  };

  const toggleEditScope = (scope: string) => {
    setEditScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  React.useEffect(() => {
    if (isEditing) {
      setEditName(apiKey.name || '');
      setEditScopes(apiKey.scopes || []);
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between py-3 px-4 gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="font-medium truncate">{apiKey.name}</p>
            <p className="text-sm text-tertiary font-mono">{apiKey.key_prefix}...</p>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {(apiKey.scopes ?? []).map((scope: string) => (
              <Chip key={scope} size="xxs" variant="secondary">
                {scope}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Chip size="xs" variant={apiKey.status === 'active' ? 'success' : 'secondary'} className="rounded-full">
            {apiKey.status}
          </Chip>

          <Button
            variant="tertiary-alt"
            size="sm"
            icon={isExpanded ? 'icon-chevron-up' : 'icon-chevron-down'}
            onClick={onToggleExpand}
          />

          <Button
            variant="tertiary-alt"
            size="sm"
            icon="icon-edit"
            onClick={() => setEditingKey(isEditing ? null : apiKey)}
          />

          <Button
            variant="tertiary-alt"
            size="sm"
            icon="icon-refresh"
            onClick={onRotate}
          />

          <Button
            variant="tertiary-alt"
            size="sm"
            icon="icon-delete"
            className="text-danger-400!"
            onClick={onRevoke}
          />
        </div>
      </div>

      {/* Expanded usage details */}
      {isExpanded && (
        <div className="px-4 pb-3 flex gap-6 text-sm text-tertiary">
          <span>Last Used: {apiKey.last_used_at ? new Date(apiKey.last_used_at).toLocaleDateString() : 'Never'}</span>
          <span>Usage: {usage?.total_calls ?? apiKey.usage_count ?? 0} calls</span>
          <span>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</span>
          {apiKey.expires_at && (
            <span>Expires: {new Date(apiKey.expires_at).toLocaleDateString()}</span>
          )}
        </div>
      )}

      {/* Inline editing */}
      {isEditing && (
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-(--color-divider) pt-3">
          <InputField
            label="Name"
            value={editName}
            onChangeText={setEditName}
          />

          {availableScopes.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Scopes</p>
              <div className="flex flex-col gap-2">
                {availableScopes.map((scope) => (
                  <Checkbox
                    key={scope}
                    id={`edit-scope-${apiKey._id}-${scope}`}
                    value={editScopes.includes(scope)}
                    onChange={() => toggleEditScope(scope)}
                  >
                    <span className="text-sm font-mono">{scope}</span>
                  </Checkbox>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="tertiary" size="sm" onClick={() => setEditingKey(null)}>
              Cancel
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- G. Quota Status Card ---
function QuotaStatusCard({ quota }: { quota: ApiQuotaStatus }) {
  const usagePercent = quota.monthly_quota > 0 ? Math.round((quota.calls_used / quota.monthly_quota) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-xl font-semibold">API Usage</h3>
        <p className="text-secondary">Current billing period usage and quota.</p>
      </div>

      <Card.Root>
        <Card.Content className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Monthly API Calls</p>
            <p className="text-sm text-tertiary">
              {quota.calls_used.toLocaleString()} / {quota.monthly_quota.toLocaleString()}
            </p>
          </div>

          <Progress value={quota.calls_used} total={quota.monthly_quota} />

          <div className="flex gap-6 text-sm text-tertiary">
            <span>Remaining: {quota.calls_remaining.toLocaleString()} calls</span>
            {quota.period && (
              <span>Period: {quota.period}</span>
            )}
          </div>

          {quota.overage_enabled && (
            <div className="flex items-center gap-2 text-sm text-warning-400">
              <i aria-hidden="true" className="icon-info size-4" />
              <p>Overage billing is active. Usage beyond the quota will be billed at the overage rate.</p>
            </div>
          )}
        </Card.Content>
      </Card.Root>
    </div>
  );
}
