'use client';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PassportStep, usePassportContext } from './provider';
import { format } from 'date-fns';

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

  return (
    <div ref={containerRef} className={twMerge('relative', className)}>
      <img 
        src={`${ASSET_PREFIX}/assets/images/passport.png`} 
        className={"w-full object-cover"}
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
