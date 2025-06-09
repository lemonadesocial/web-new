'use client';
import React from 'react';
import clsx from 'clsx';
import { Card } from '$lib/components/core';

export function PageTitle({
  title,
  subtitle,
  children,
}: React.PropsWithChildren & { title: string; subtitle?: string }) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-3">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl leading-none font-semibold">{title}</h1>
        {subtitle && <p className="text-sm md:text-base text-tertiary">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}

export function PageSection({
  title,
  toolbar,
  children,
}: React.PropsWithChildren & { title: string; toolbar?: () => React.ReactElement }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl md:text-2xl font-semibold">{title}</h3>
        {toolbar?.()}
      </div>

      {children}
    </div>
  );
}

export function PageCardItem({
  image,
  title,
  subtitle,
  onClick,
  containerClass,
  view = 'card',
}: {
  title: string;
  subtitle?: string;
  image?: { class?: string; src: string };
  containerClass?: string;
  view?: 'card' | 'list-item';
  onClick?: () => void;
}) {
  if (view === 'list-item') {
    return (
      <Card.Root onClick={onClick} className={containerClass}>
        <Card.Content className="flex gap-3 items-center">
          <div className="w-[48px] h-[48px]">
            <img className={clsx('w-full h-full', image?.class)} src={image?.src} />
          </div>
          <div className="flex flex-col gap-1 w-full flex-1">
            <p className="font-title md:text-xl font-semibold">{title}</p>
            {subtitle && <p className="text-sm md:text-base text-tertiary line-clamp-2">{subtitle}</p>}
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <Card.Root onClick={onClick} className={containerClass}>
      <Card.Content className="flex flex-col gap-6">
        <div className="w-[32px] h-[32px] md:w-[48px] md:h-[48px]">
          <img className={clsx('w-full h-full', image?.class)} src={image?.src} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-title md:text-xl font-semibold">{title}</p>
          {subtitle && <p className="text-tertiary">{subtitle}</p>}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
