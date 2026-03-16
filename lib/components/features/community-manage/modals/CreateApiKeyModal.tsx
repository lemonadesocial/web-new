'use client';

import React from 'react';
import { addDays } from 'date-fns';

import { Button, InputField, modal, ModalContent, MultiSelect, Select, toast } from '$lib/components/core';
import { CreateApiKeyDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { getErrorMessage } from '$lib/utils/error';
import { copy } from '$lib/utils/helpers';

type CreateApiKeyModalProps = {
  spaceId: string;
  availableScopes: string[];
  onCreated?: () => void | Promise<void>;
};

type ApiKeySecretModalProps = {
  secret: string;
};

const EXPIRES_OPTIONS = ['7 days', '30 days', '60 days', '90 days', '1 year', 'Never'];

function getExpiresAt(value: string) {
  if (value === 'Never') return undefined;
  if (value === '7 days') return addDays(new Date(), 7).toISOString();
  if (value === '30 days') return addDays(new Date(), 30).toISOString();
  if (value === '60 days') return addDays(new Date(), 60).toISOString();
  if (value === '90 days') return addDays(new Date(), 90).toISOString();
  if (value === '1 year') return addDays(new Date(), 365).toISOString();
  return addDays(new Date(), 7).toISOString();
}

export function ApiKeySecretModal({ secret }: ApiKeySecretModalProps) {
  return (
    <ModalContent
      icon="icon-check"
      className="w-[480px] max-w-full [&_[data-icon]]:bg-success-400/16 [&_[data-icon]_i]:text-success-400"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">API Key Created</p>
          <p className="text-sm text-secondary">
            This key will only be shown once. Copy it now and store it in a safe, secure location.
          </p>
          <p className="text-sm text-secondary">
            Only use this key for your own development. Don&apos;t share it with third-party services and
            applications.
          </p>
        </div>

        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <InputField readOnly value={secret} />
          </div>
          <Button
            variant="tertiary-alt"
            icon="icon-copy"
            aria-label="Copy API key"
            onClick={() => {
              copy(secret);
              toast.success('Copied API key.');
            }}
          />
        </div>

        <Button className="w-full" variant="secondary" onClick={() => modal.close()}>
          Done
        </Button>
      </div>
    </ModalContent>
  );
}

export function CreateApiKeyModal({ spaceId, availableScopes, onCreated }: CreateApiKeyModalProps) {
  const [name, setName] = React.useState('');
  const [scopes, setScopes] = React.useState<string[]>([]);
  const [expiresIn, setExpiresIn] = React.useState('7 days');

  const [createApiKey, { loading }] = useMutation(CreateApiKeyDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleSubmit = async () => {
    if (!name.trim() || !scopes.length) return;

    const { data } = await createApiKey({
      variables: {
        input: {
          space: spaceId,
          name: name.trim(),
          scopes,
          expires_at: getExpiresAt(expiresIn),
        },
      },
    });

    const created = data?.createApiKey;
    if (!created?.secret) {
      toast.error('Failed to create API key.');
      return;
    }

    await onCreated?.();
    modal.close();
    modal.open(ApiKeySecretModal, {
      dismissible: false,
      props: { secret: created.secret },
    });
    toast.success('API key created.');
  };

  return (
    <ModalContent icon="icon-key" onClose={() => modal.close()} className="w-[480px] max-w-full">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Create API Key</p>
          <p className="text-sm text-secondary">
            API keys allow you to access Lemonade data and automate actions from your own tools and services. Keep
            your keys private - never share them or use them in client-side code.
          </p>
        </div>

        <div className="space-y-2">
          <InputField label="Name" value={name} onChangeText={setName} />
          <p className="text-sm text-tertiary">Used to identify this key.</p>
        </div>

        <div className="space-y-2">
          <div className="space-y-1.5">
            <p className="text-sm text-secondary">Scopes</p>
            <MultiSelect
              value={scopes}
              onChange={setScopes}
              options={availableScopes}
              placeholder={availableScopes.length ? 'Select one or more' : 'No scopes available'}
            />
          </div>
          <p className="text-sm text-tertiary">Only grant the scopes your integration needs.</p>
        </div>

        <div className="flex items-center gap-1.5">
          <p className="text-sm text-secondary flex-1">Expires In</p>
          <div className="flex-1">
            <Select
              value={expiresIn}
              onChange={(value) => setExpiresIn(value || '7 days')}
              options={EXPIRES_OPTIONS}
            />
          </div>
        </div>

        <Button
          className="w-full"
          variant="secondary"
          loading={loading}
          disabled={!name.trim() || !scopes.length || !availableScopes.length}
          onClick={handleSubmit}
        >
          Create Key
        </Button>
      </div>
    </ModalContent>
  );
}
