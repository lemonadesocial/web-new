'use client';
import clsx from 'clsx';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { preload } from 'react-dom';

import { Button, Card, modal } from '$lib/components/core';
import { LemonHeadsColor } from '$lib/trpc/lemonheads/types';
import { isMobile } from 'react-device-detect';

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
          'border-2 p-1 cursor-pointer rounded-md w-full h-full aspect-square flex justify-center items-center hover:border-quaternary',
          active && 'border-primary!',
        )}
      >
        {children}
      </div>
      {label && (
        <p className={clsx('text-sm capitalize line-clamp-1 text-center', active ? 'text-primary' : 'text-tertiary')}>
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
}: {
  selected?: string;
  colorset?: LemonHeadsColor;
  onSelect: (params: { key: string; value: string }) => void;
}) {
  const colors = colorset?.value || [];

  if (isMobile) {
    return (
      <div className="flex gap-1 border-t p-4">
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
    );
  }

  return (
    <Card.Root className="absolute left-4 bottom-4 max-h-[52px] rounded-full p-3 bg-overlay-secondary">
      <Card.Content className="p-0 flex gap-1 rounded-full">
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
      </Card.Content>
    </Card.Root>
  );
}

export function ConfirmModal({
  title,
  subtitle,
  onConfirm,
}: {
  onConfirm: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-info text-danger-400" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm font-medium text-secondary">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={() => {
            modal.close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => {
            modal.close();
            onConfirm();
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
