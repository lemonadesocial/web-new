'use client';
import React, { useState } from 'react';
import { Button, Input, InputField, modal, ModalContent, toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { CreateOauth2ClientDocument } from '$lib/graphql/generated/backend/graphql';

export function CreateOauth2ClientModal({ onRefetch }: { onRefetch: () => void }) {
  const [name, setName] = useState('');
  const [createdData, setCreatedData] = useState<{
    client_id: string;
    client_secret: string;
    audience: string[];
  } | null>(null);
  const [createOauth2, { loading }] = useMutation(CreateOauth2ClientDocument);

  const handleCreate = async () => {
    try {
      const { data } = await createOauth2({
        variables: {
          input: {
            client_name: name.trim() || undefined,
          },
        },
      });

      if (data?.createOauth2Client) {
        toast.success('OAuth2 client created.');
        onRefetch();
        setCreatedData({
          client_id: data.createOauth2Client.client_id,
          client_secret: data.createOauth2Client.client_secret,
          audience: data.createOauth2Client.audience as string[],
        });
      }
    } catch (e) {
      toast.error('Failed to create OAuth2 client.');
    }
  };

  const handleDownload = () => {
    if (!createdData) return;
    const text = [
      `Client ID: ${createdData.client_id}`,
      `Client Secret: ${createdData.client_secret}`,
      ...(createdData.audience[0] ? [`Audience: ${createdData.audience[0]}`] : []),
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oauth2-client-${createdData.client_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (createdData) {
    return (
      <ModalContent className="p-8 space-y-6 w-112 max-w-full">
        <div className="flex flex-col gap-6">
          <div className="size-14 flex justify-center items-center rounded-full bg-success/10">
            <i aria-hidden="true" className="icon-check text-success size-8" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-primary">OAuth2 Client Created</h2>
            <p className="text-sm text-tertiary leading-relaxed font-medium">
              Your OAuth2 client is ready to use. Copy or download your credentials below before moving on. Your client
              secret will only be shown once and cannot be recovered.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                readOnly
                value={createdData.client_secret}
                className="w-full h-12 bg-transparent border-white/20 rounded-xl font-mono text-sm"
              />
            </div>
            <Button
              icon="icon-download"
              variant="secondary"
              className="h-12 w-12 flex-shrink-0 bg-white/10 border-none rounded-xl hover:bg-white/20"
              onClick={handleDownload}
            />
          </div>

          <Button
            onClick={() => modal.close()}
            className="w-full bg-white/20 text-primary hover:bg-white/30 border-none h-13 rounded-xl font-bold text-lg"
          >
            I've Saved My Secret
          </Button>
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent icon="icon-manage-accounts-outline" className="w-full max-w-sm md:max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-primary">New OAuth2 Client</p>
          <p className="text-sm text-secondary">
            Give your client a name to identify it. You can configure redirect URLs after it's created.
          </p>
        </div>

        <InputField
          placeholder="My Mobile App"
          value={name}
          label="Name (Optional)"
          onChange={(e) => setName(e.target.value)}
        />

        <Button loading={loading} onClick={handleCreate} variant="secondary">
          Create Client
        </Button>
      </div>
    </ModalContent>
  );
}
