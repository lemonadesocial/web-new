'use client';

import React from 'react';
import { format } from 'date-fns';

import { Button, InputField, modal, ModalContent, MultiSelect, Select, toast } from '$lib/components/core';
import { ApiKeyBase, UpdateApiKeyDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { getErrorMessage } from '$lib/utils/error';

type EditApiKeyModalProps = {
  apiKey: ApiKeyBase;
  availableScopes: string[];
  onUpdated?: () => void | Promise<void>;
};

function getExpiresLabel(expiresAt?: string | null) {
  if (!expiresAt) return 'Never';
  return format(new Date(expiresAt), 'MMM dd, yyyy');
}

export function EditApiKeyModal({ apiKey, availableScopes, onUpdated }: EditApiKeyModalProps) {
  const [name, setName] = React.useState(apiKey.name || '');
  const [scopes, setScopes] = React.useState<string[]>(apiKey.scopes || []);
  const expiresLabel = getExpiresLabel(apiKey.expires_at);

  const [updateApiKey, { loading }] = useMutation(UpdateApiKeyDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const hasChanges =
    name.trim() !== (apiKey.name || '') ||
    JSON.stringify([...scopes].sort()) !== JSON.stringify([...(apiKey.scopes || [])].sort());

  const handleSave = async () => {
    if (!name.trim() || !scopes.length) return;

    await updateApiKey({
      variables: {
        id: apiKey._id,
        input: {
          name: name.trim(),
          scopes,
        },
      },
    });

    await onUpdated?.();
    toast.success('API key updated.');
    modal.close();
  };

  return (
    <ModalContent icon="icon-key" onClose={() => modal.close()} className="w-[480px] max-w-full">
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Edit API Key</p>
          <p className="text-lg text-tertiary">{apiKey.key_prefix}</p>
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
            <Select value={expiresLabel} onChange={() => {}} options={[expiresLabel]} disabled removeable={false} />
          </div>
        </div>

        <Button className="w-full" variant="secondary" loading={loading} disabled={!hasChanges} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </ModalContent>
  );
}
