'use client';
import { twMerge } from 'tailwind-merge';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportStep, usePassportContext } from './provider';

export function PassportPreview({ className }: { className?: string }) {
  const [state] = usePassportContext();

  if (state.currentStep === PassportStep.celebrate) return null;

  return (
    <>
      <img
        src={`${ASSET_PREFIX}/assets/images/passport.png`}
        className={twMerge('md:hidden w-full object-cover', className)}
      />

      <div className={twMerge('hidden md:block flex-1 h-full pt-6 pb-12', className)}>
        <div
          className="h-full flex items-center rounded-md p-12 bg-primary/8"
          style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/preview-bg.png)` }}
        >
          <img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="w-full object-cover" />
        </div>
      </div>
    </>
  );
}
