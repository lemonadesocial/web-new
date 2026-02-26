import { ModalContent } from "$lib/components/core";

export function ProcessingTransaction({ imgSrc, title, description }: { imgSrc: string; title: string; description: string; }) {
  return (
    <ModalContent>
      <div className='space-y-4'>
        {
          imgSrc ? (
            <div className='size-14 flex items-center justify-center rounded-full bg-background/64 relative'>
              <div className='absolute -inset-1 rounded-full border-2 border-transparent'>
                <div className='w-full h-full rounded-full border-2 border-tertiary border-t-transparent border-r-transparent animate-spin'></div>
              </div>
              <img src={imgSrc} alt='Unicorn Logo' className='w-[26px] relative z-10' />
            </div>
          ) : (
            <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
              <i className="icon-loader animate-spin" />
            </div>
          )
        }
        <div className='space-y-1'>
          <p className='text-lg'>{title}</p>
          <p className='text-sm text-secondary'>{description}</p>
        </div>
      </div>
    </ModalContent>
  );
}
