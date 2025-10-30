'use client';
import { twMerge } from 'tailwind-merge';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { usePassportContext } from './provider';
import { Skeleton } from '$lib/components/core';

export function PassportPreview({ loading }: { loading?: boolean }) {
  return (
    <>
      <ImagePreview className="md:hidden" loading={loading} />

      <div className='hidden md:block flex-1 h-full pt-6 pb-12'>
        <div
          className="h-full flex items-center rounded-md p-12 bg-primary/8"
          style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/preview-bg.png)` }}
        >
          <ImagePreview loading={loading} />
        </div>
      </div>
    </>
  );
}

function ImagePreview({ className, loading }: { className?: string; loading?: boolean }) {
  const [state] = usePassportContext();

  if (loading) {
    return (
      <div className={twMerge('w-full bg-[#FFCE01] rounded-lg p-6 aspect-[8/5]', className)}>
        <div className="text-center mb-4">
          <Skeleton animate className="h-6 w-48 mx-auto bg-black/60" />
        </div>
        <div className="flex gap-4">
          <Skeleton animate className="w-32 h-32 bg-black/40" />
          <div className="flex-1 space-y-3">
            <Skeleton animate className="h-4 w-full bg-black/60" />
            <Skeleton animate className="h-4 w-3/4 bg-black/40" />
            <Skeleton animate className="h-4 w-1/2 bg-black/60" />
          </div>
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
