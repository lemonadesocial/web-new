'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { skipToken } from '@tanstack/react-query';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { usePassportContext } from './provider';
import { PassportStep, PassportActionKind } from './provider';
import { trpc } from '$lib/trpc/client';

export function PassportPreview() {
  return (
    <>
      <ImagePreview className="md:hidden" />

      <div className="hidden md:block flex-1 h-full pt-6 pb-12">
        <div
          className="h-full flex items-center rounded-md p-12 bg-primary/8"
          style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/preview-bg.png)` }}
        >
          <ImagePreview />
        </div>
      </div>
    </>
  );
}

function ImagePreview({ className }: { className?: string }) {
  const [state, dispatch] = usePassportContext();

  const variables =
    state.currentStep === PassportStep.intro
      ? skipToken
      : { avatarImageUrl: state.photo, username: state.ensName, provider: 'vinyl-nation' };

  const getImage = trpc.passport.getImage.useQuery(variables);
  const loading = getImage.isLoading;

  React.useEffect(() => {
    const img = getImage.data?.image;

    if (img && img !== state.passportImage) {
      dispatch({ type: PassportActionKind.SetPassportImage, payload: img });
    }
  }, [getImage.data?.image, state.passportImage, dispatch]);

  if (loading) {
    return (
      <div className={twMerge('relative', className)}>
        <img
          src={`${ASSET_PREFIX}/assets/images/passports/vinyl-nation-passport-mini.png`}
          className="w-full object-cover"
        />
      </div>
    );
  }

  if (state.passportImage)
    return <img src={state.passportImage} className={twMerge('w-full object-cover', className)} />;

  return (
    <div className={twMerge('relative', className)}>
      <img
        src={`${ASSET_PREFIX}/assets/images/passports/vinyl-nation-passport-mini.png`}
        className="w-full object-cover"
      />
    </div>
  );
}
