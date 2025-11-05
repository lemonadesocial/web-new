'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { usePassportContext } from './provider';
import { PassportStep, PassportActionKind } from './provider';
import { trpc } from '$lib/trpc/client';
import { useMe } from '$lib/hooks/useMe';
import { useAppKitAccount } from '$lib/utils/appkit';

export function PassportPreview() {
  return (
    <>
      <ImagePreview className="md:hidden" />

      <div className='hidden md:block flex-1 h-full pt-6 pb-12'>
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

function ImagePreview({ className }: { className?: string; }) {
  const [state, dispatch] = usePassportContext();

  const getImage = trpc.zugrama.getImage.useMutation();
  const loading = getImage.isPending;

  React.useEffect(() => {
    if (state.currentStep === PassportStep.intro) return;

    getImage.mutate({
      avatarImageUrl: state.photo,
      username: state.ensName,
    });
  }, [state.currentStep, state.photo, state.ensName]);

  React.useEffect(() => {
    const img = getImage.data?.image;
    
    if (img && img !== state.passportImage) {
      dispatch({ type: PassportActionKind.SetPassportImage, payload: img });
    }
  }, [getImage.data?.image, state.passportImage, dispatch]);


  if (loading) {
    return (
      <div className={twMerge('w-full rounded-xl aspect-[8/5] overflow-hidden', className)}>
        <div className="h-full w-full bg-gradient-to-b from-[#2B2B2B] to-[#0F0F0F] p-6 md:p-8 relative">
          <div className="h-10 w-40 mx-auto mb-6 rounded-md animate-skeleton bg-linear-to-r from-[#C6FF3D]/30 via-[#E9FF9A]/40 to-[#C6FF3D]/30" />
          <div className="flex gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-lg animate-skeleton bg-linear-to-r from-[#C6FF3D]/60 via-[#D8FF70]/70 to-[#C6FF3D]/60" />
            </div>
            <div className="flex-1">
              <div className="h-10 max-w-md rounded-md animate-skeleton bg-linear-to-r from-[#C6FF3D]/50 via-[#E9FF9A]/60 to-[#C6FF3D]/50 mb-6" />
              <div className="grid grid-cols-2 gap-6">
                <div className="h-3 w-28 rounded animate-skeleton bg-linear-to-r from-white/10 via-white/20 to-white/10" />
                <div className="h-3 w-28 rounded animate-skeleton bg-linear-to-r from-white/10 via-white/20 to-white/10" />
                <div className="h-3 w-20 rounded animate-skeleton bg-linear-to-r from-white/10 via-white/20 to-white/10" />
                <div className="h-3 w-24 rounded animate-skeleton bg-linear-to-r from-white/10 via-white/20 to-white/10" />
              </div>
            </div>
          </div>
          <div className="absolute left-0 right-0 bottom-0 h-12 animate-skeleton bg-linear-to-r from-[#C6FF3D]/70 via-[#E9FF9A]/80 to-[#C6FF3D]/70" />
        </div>
      </div>
    );
  }

  if (state.passportImage) return (
    <img
      src={state.passportImage}
      className={twMerge('w-full object-cover', className)}
    />
  );

  return (
    <div className={twMerge('relative', className)}>
      <img
        src={`${ASSET_PREFIX}/assets/images/zugrama-passport-placeholder.png`}
        className="w-full object-cover"
      />
    </div>
  );
}
