'use client';
import React from 'react';
import { Sheet, SheetDetent, SheetRef } from 'react-modal-sheet';
import { twMerge } from 'tailwind-merge';

interface Options<T> {
  props?: T;
  contentClass?: string;
  containerClass?: string;
  detent?: SheetDetent;
}

interface BottomSheet {
  open: <T extends object>(component: React.ComponentType<T>, options?: Options<T>) => void;
  close: () => void;
}

export const sheet: BottomSheet = {
  open: () => {
    throw new Error('BottomSheet not initialized');
  },
  close: () => {
    throw new Error('BottomSheet not initialized');
  },
};

export function BottomSheetContainer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>();
  const [options, setOptions] = React.useState<Options<unknown>>({});

  const ref = React.useRef<SheetRef>(null);

  const handleOpen = React.useCallback(<T extends object>(Component: React.ComponentType<T>, opts: Options<T> = {}) => {
    setContent(<Component {...(opts.props as T)} />);
    setOptions((prev) => ({ ...prev, ...opts }));
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  React.useEffect(() => {
    sheet.open = handleOpen;
    sheet.close = handleClose;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <Sheet ref={ref} isOpen={isOpen} onClose={() => handleClose()} avoidKeyboard detent={options.detent}>
      <Sheet.Container
        className={twMerge('bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl', options.containerClass)}
      >
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg bg-overlay-primary/80 backdrop-blur-2xl">
          <div className="flex justify-center items-end h-[20px]">
            <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag className={twMerge('bg-overlay-primary/80 backdrop-blur-2xl', options.contentClass)}>
          {content}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
