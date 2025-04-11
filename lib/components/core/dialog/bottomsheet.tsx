'use client';
import React from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';

interface Options<T> {
  props?: T;
  snapPoints?: number[];
  contentClass?: string;
  initialSnap?: number;
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
  const [options, setOptions] = React.useState<Options<unknown>>({
    snapPoints: [600, 400, 100, 0],
    initialSnap: 0,
  });

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
  }, [isOpen]);

  return (
    <Sheet
      ref={ref}
      isOpen={isOpen}
      onClose={() => handleClose()}
      snapPoints={options.snapPoints}
      initialSnap={options.initialSnap}
    >
      <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-center items-end h-[20px]">
            <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <Sheet.Scroller draggableAt="top">
            <div>{content}</div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
