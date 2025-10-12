'use client';
import { twMerge } from 'tailwind-merge';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportStep, usePassportContext } from './provider';

export function PassportPreview() {
  const [state] = usePassportContext();

  if (state.currentStep === PassportStep.celebrate) return null;

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

function ImagePreview({ className }: { className?: string }) {
  const [state] = usePassportContext();

  return (
    <div className={twMerge('relative', className)}>
      <img src={`${ASSET_PREFIX}/assets/images/passport.png`} className={"w-full object-cover"} />
      {
        state.photo && (
          <img
            src={state.photo}
            className="absolute top-[27%] w-[28.5%] left-[8%] rounded"
          />
        )
      }
    </div>
  );
}
