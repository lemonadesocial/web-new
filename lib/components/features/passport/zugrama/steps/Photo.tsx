'use client';
import React, { useEffect } from 'react';

import { Button, Card, modal } from '$lib/components/core';
import { Skeleton } from '$lib/components/core/skeleton';
import { GetSelfVerificationStatusDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { SELF_VERIFICATION_CONFIG } from '$lib/utils/constants';
import { PassportActionKind, usePassportContext } from '../provider';
import { GetVerifiedModal } from '$lib/components/features/modals/GetVerifiedModal';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import { FileInput } from '$lib/components/core/file-input';
import { uploadFiles } from '$lib/utils/file';

export function PassportPhoto() {

  return (
    <div className="flex-1 flex flex-col gap-8 md:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold leading-tight">Choose your passport photo.</h1>
        {/* <p className="text-tertiary">Select an NFT from your wallet or upload a photo.</p> */}
      </div>

      <div className="flex flex-col gap-4">
        <VerifySelf />

        <UploadPhoto />
      </div>
    </div>
  );
}

function VerifySelf() {
  const [state, dispatch] = usePassportContext();

  const { data, loading } = useQuery(GetSelfVerificationStatusDocument, {
    variables: {
      config: SELF_VERIFICATION_CONFIG
    },
  });

  useEffect(() => {
    if (data?.getSelfVerificationStatus) {
      const allVerified = data.getSelfVerificationStatus.disclosures?.every((d: any) => d.verified);
      dispatch({ type: PassportActionKind.SetSelfVerified, payload: allVerified });
    }
  }, [data]);

  if (loading) return (
    <Card.Root>
      <Card.Content className="py-3 flex items-center gap-3">
        <Skeleton animate className="w-9 h-9 rounded-sm" />
        <div className="space-y-1 flex-1">
          <Skeleton animate className="h-4 w-28 rounded-full" />
          <Skeleton animate className="h-3 w-64 rounded-full" />
        </div>
        <Skeleton animate className="h-8 w-20 rounded-sm" />
      </Card.Content>
    </Card.Root>
  );

  if (state.isSelfVerified) return (
    <Card.Root>
      <Card.Content className="py-3 flex items-center gap-3">
        <div className="flex items-center justify-center p-2 rounded-sm bg-accent-400/16 aspect-square">
          <i className="icon-verified-outline size-[22px] text-accent-400" />
        </div>
        <div className="space-y-0.5 flex-1">
          <p className="text-accent-400">Verified</p>
          <p className="text-sm text-tertiary">You have successfully verified you are a unique human.</p>
        </div>
      </Card.Content>
    </Card.Root>
  );

  return (
    <Card.Root>
      <Card.Content className="py-3 flex items-center gap-3">
        <div className="flex items-center justify-center p-2 rounded-sm bg-(--btn-tertiary) aspect-square">
          <i className="icon-verified-outline size-[22px]" />
        </div>
        <div className="space-y-0.5 flex-1">
          <p>Get Verified</p>
          <p className="text-sm text-tertiary">Prove you are a unique human and not a bot to continue.</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            modal.open(GetVerifiedModal, {
              props: {
                config: SELF_VERIFICATION_CONFIG
              }
            });
          }}
        >
          Verify
        </Button>
      </Card.Content>
    </Card.Root>
  );
}

function UploadPhoto() {
  const me = useMe();
  const [state, dispatch] = usePassportContext();
  const [uploading, setUploading] = React.useState(false);

  useEffect(() => {
    if (me?.new_photos_expanded?.length && !state.photo) {
      dispatch({ type: PassportActionKind.SetPhoto, payload: generateUrl(me.new_photos_expanded[0]) });
    }
  }, [me, state.photo]);

  return (
    <Card.Root>
      <Card.Content className="py-3 flex items-center gap-3">
        {state.photo ? (
          <img src={state.photo} className="w-[38px] h-[38px] object-cover rounded-sm border border-divider" />
        ) : uploading ? (
          <div className="flex items-center justify-center p-2 rounded-sm bg-(--btn-tertiary) aspect-square">
            <Skeleton animate className="w-[22px] h-[22px] rounded" />
          </div>
        ) : (
          <div className="flex items-center justify-center p-2 rounded-sm bg-(--btn-tertiary) aspect-square">
            <i className="icon-image size-[22px]" />
          </div>
        )}
        <div className="space-y-0.5 flex-1">
          <p>Passport Photo</p>
          <p className="text-sm text-tertiary">Choose a square image (1:1) below 5MB.</p>
        </div>
        <FileInput
          accept="image/*"
          multiple={false}
          onChange={async (files) => {
            if (!files.length) return;
            setUploading(true);
            try {
              const results = await uploadFiles([files[0]], 'user');
              if (results[0]) {
                dispatch({ type: PassportActionKind.SetPhoto, payload: results[0].url });
              }
            } catch {
            } finally {
              setUploading(false);
            }
          }}
        >
          {(open) => (
            <Button
              variant="secondary"
              size="sm"
              iconLeft="icon-upload-sharp"
              onClick={open}
              loading={uploading}
            >
              Upload
            </Button>
          )}
        </FileInput>
      </Card.Content>
    </Card.Root>
  );
}
