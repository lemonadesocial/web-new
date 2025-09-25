'use client';
import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { preload } from 'react-dom';

import { Button, Card, modal } from '$lib/components/core';
import { LemonHeadsColor } from '$lib/trpc/lemonheads/types';

export function CanvasImageRenderer({ file, style }: { file: string; style?: React.CSSProperties }) {
  const canvasRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (canvasRef.current && file) {
      preload(file, { as: 'image' });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const devicePixelRatio = 1;
        canvas.width = img.width * devicePixelRatio;
        canvas.height = img.height * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.drawImage(img, 0, 0);
      };

      img.src = file;
    }
  }, [file]);

  return <canvas ref={canvasRef} className="w-full h-full aspect-square" style={style} />;
}

export function SquareButton({
  className,
  label,
  active = false,
  onClick,
  children,
  style,
}: React.PropsWithChildren & {
  label?: string;
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div className={clsx('flex flex-col gap-1 items-center w-full', className)}>
      <div
        onClick={onClick}
        style={style}
        className={twMerge(
          'border-2 p-1 cursor-pointer rounded-sm md:rounded-md w-full h-full aspect-square flex justify-center items-center hover:border-quaternary',
          active && 'border-primary!',
        )}
      >
        {children}
      </div>
      {label && (
        <p
          className={clsx(
            'h-full text-sm capitalize line-clamp-1 text-center',
            active ? 'text-primary' : 'text-tertiary',
          )}
        >
          {label.replaceAll('_', ' ')}
        </p>
      )}
    </div>
  );
}

export function ColorTool({
  selected,
  colorset,
  onSelect,
  onDelete,
}: {
  selected?: string;
  colorset?: LemonHeadsColor;
  onSelect: (params: { key: string; value: string }) => void;
  onDelete: () => void;
}) {
  const colors = colorset?.value || [];

  return (
    <>
      <div className="flex md:hidden items-center justify-between border-t p-4 gap-3.5">
        {!!colors.length ? (
          <div className="flex gap-1 flex-1 overflow-x-auto no-scrollbar">
            {colors.map((c) => (
              <div
                key={c.value}
                onClick={() => onSelect(c)}
                className={clsx(
                  'w-[28px] h-[28px] aspect-square flex items-center justify-center rounded-full border-2 cursor-pointer hover:bg-(--btn-tertiary)',
                  selected === c.key ? 'border-primary' : 'border-transparent',
                )}
              >
                <div className="w-[20px] h-[20px] rounded-full aspect-square" style={{ background: c.value }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <Button icon="icon-richtext-trash" className="rounded-full" size="sm" variant="danger" onClick={onDelete} />
      </div>
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 bg-transparent">
        {!!colors.length ? (
          <Card.Root className="max-h-[52px] rounded-full p-3 bg-overlay-secondary">
            <Card.Content className="p-0">
              <div className="flex gap-1 rounded-full w-full overflow-x-auto no-scrollbar">
                {colors.map((c) => (
                  <div
                    key={c.value}
                    onClick={() => onSelect(c)}
                    className={clsx(
                      'w-[28px] h-[28px] aspect-square flex items-center justify-center rounded-full border-2 cursor-pointer hover:bg-(--btn-tertiary)',
                      selected === c.key ? 'border-primary' : 'border-transparent',
                    )}
                  >
                    <div className="w-[20px] h-[20px] rounded-full aspect-square" style={{ background: c.value }} />
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card.Root>
        ) : (
          <div />
        )}
        <Button icon="icon-richtext-trash" className="rounded-full" size="sm" variant="danger" onClick={onDelete} />
      </div>
    </>
  );
}
