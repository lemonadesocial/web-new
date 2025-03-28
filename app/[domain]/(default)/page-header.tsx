'use client';

import React, { ReactElement } from 'react';

export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string | ReactElement }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl leading-none font-semibold">{title}</h1>
      {subtitle && <div className="text-tertiary">{subtitle}</div>}
    </div>
  );
}
