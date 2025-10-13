'use client';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportStep, usePassportContext } from './provider';
import { format } from 'date-fns';
import { Skeleton } from '$lib/components/core';

export function PassportPreview({ loading }: { loading?: boolean }) {
  const [state] = usePassportContext();

  if (state.currentStep === PassportStep.celebrate) return null;

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(16);

  const updateFontSize = () => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight;
      const calculatedFontSize = (height / 400) * 16;
      setFontSize(calculatedFontSize);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateFontSize);
    return () => window.removeEventListener('resize', updateFontSize);
  }, []);

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
    <div ref={containerRef} className={twMerge('relative', className)}>
      <img
        src={`${ASSET_PREFIX}/assets/images/passport.png`}
        className="w-full object-cover"
        onLoad={updateFontSize}
      />
      {
        state.photo && (
          <img
            src={state.photo}
            className="absolute top-[27%] w-[28.5%] left-[8%] rounded-[5%]"
          />
        )
      }
      <p
        className="absolute top-[50.5%] left-[70%] text-black font-multitype-pixel"
        style={{ fontSize: `${fontSize}px` }}
      >
        {format(new Date(), 'MM/dd/yyyy')}
      </p>
    </div>
  );
}
