'use client';

import { Button, InputField, modal, ModalContent, toast } from '$lib/components/core';
import { ApiKeyBase, RotateApiKeyDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { getErrorMessage } from '$lib/utils/error';
import { copy } from '$lib/utils/helpers';

type RegenerateApiKeyModalProps = {
  apiKey: ApiKeyBase;
  onRegenerated?: () => void | Promise<void>;
};

function ApiKeyRegeneratedSuccessModal({ secret }: { secret: string }) {
  return (
    <ModalContent
      icon="icon-check"
      className="w-120 max-w-full [&_[data-icon]]:bg-success-400/16 [&_[data-icon]_i]:text-success-400"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">API Key Regenerated</p>
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
            icon="icon-download"
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

export function RegenerateApiKeyModal({ apiKey, onRegenerated }: RegenerateApiKeyModalProps) {
  const [rotateApiKey, { loading }] = useMutation(RotateApiKeyDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleRegenerate = async () => {
    const { data } = await rotateApiKey({ variables: { id: apiKey._id } });
    const rotated = data?.rotateApiKey;

    if (!rotated?.secret) {
      toast.error('Failed to regenerate API key.');
      return;
    }

    await onRegenerated?.();
    modal.close();
    modal.open(ApiKeyRegeneratedSuccessModal, {
      dismissible: false,
      props: { secret: rotated.secret },
    });
  };

  return (
    <ModalContent
      icon="icon-error"
      className="w-120 max-w-full [&_[data-icon]]:bg-warning-300/16 [&_[data-icon]_i]:text-warning-300"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Regenerate Key?</p>
          <p className="text-sm text-secondary">
            This action cannot be undone. Any services or applications using the {apiKey.name} key will need to be
            updated.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="tertiary-alt" className="flex-1" onClick={() => modal.close()}>
            Cancel
          </Button>
          <Button variant="secondary" className="flex-1" loading={loading} onClick={handleRegenerate}>
            Regenerate
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
