'use client';
import { Button, Card, modal } from '$lib/components/core';
import { Skeleton } from '$lib/components/core/skeleton';
import { GetSelfVerificationStatusDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { SELF_VERIFICATION_CONFIG } from '$lib/utils/constants';
import { GetVerifiedModal } from '$lib/components/features/modals/GetVerifiedModal';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import { FileInput } from '$lib/components/core/file-input';
import { uploadFiles } from '$lib/utils/file';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';

import { usePassportContext } from '../provider';
import { LemonheadCard, FluffleCard } from './PhotoCards';
import React from 'react';
import { PassportActionKind } from '../types';

export function PassportPhoto() {
  const [state] = usePassportContext();

  return (
    <div className="flex-1 flex flex-col gap-8 md:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold leading-tight">{state.ui?.[state.currentStep!]?.title}</h1>
        <p className="text-tertiary">{state.ui?.[state.currentStep!]?.subtitle}</p>
      </div>

      {(state.enabled?.lemohead || state.enabled?.fluffePhoto) && (
        <div className="grid grid-cols-2 gap-4">
          {state.enabled?.lemohead && <LemonheadCard />}
          {state.enabled?.fluffePhoto && <FluffleCard />}
        </div>
      )}

      {(state.enabled?.selfVerify || state.enabled?.uploadPhoto) && (
        <div className="flex flex-col gap-4">
          {state.enabled.selfVerify && <VerifySelf />}
          {state.enabled.uploadPhoto && <UploadPhoto />}
        </div>
      )}
    </div>
  );
}

function VerifySelf() {
  const [state, dispatch] = usePassportContext();

  const session = useSession();
  const signIn = useSignIn();

  const { data, loading } = useQuery(GetSelfVerificationStatusDocument, {
    variables: {
      config: SELF_VERIFICATION_CONFIG,
    },
    skip: !session,
  });

  React.useEffect(() => {
    if (data?.getSelfVerificationStatus) {
      const allVerified = data.getSelfVerificationStatus.disclosures?.every((d: any) => d.verified);
      dispatch({ type: PassportActionKind.SetSelfVerified, payload: allVerified });
    }
  }, [data]);

  if (loading)
    return (
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

  if (state.isSelfVerified)
    return (
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

        {session ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              modal.open(GetVerifiedModal, {
                props: {
                  config: SELF_VERIFICATION_CONFIG,
                },
              });
            }}
          >
            Verify
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </Card.Content>
    </Card.Root>
  );
}

function UploadPhoto() {
  const me = useMe();
  const session = useSession();
  const [state, dispatch] = usePassportContext();
  const [uploading, setUploading] = React.useState(false);
  const signIn = useSignIn();

  React.useEffect(() => {
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
        {session ? (
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
              <Button variant="secondary" size="sm" iconLeft="icon-upload-sharp" onClick={open} loading={uploading}>
                Upload
              </Button>
            )}
          </FileInput>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => signIn()}>
            Sign In
          </Button>
        )}
      </Card.Content>
    </Card.Root>
  );
}
