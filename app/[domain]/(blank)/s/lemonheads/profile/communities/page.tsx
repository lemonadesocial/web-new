'use client';
import React from 'react';
import { MyHubs } from '$lib/components/features/community/MyHubs';
import { TitleSection } from '../../shared';
import { match } from 'ts-pattern';
import { Button, Segment } from '$lib/components/core';
import { useRouter } from 'next/navigation';
import { SubcribeHubs } from '$lib/components/features/community/SubcribeHubs';

const tabs = [
  { label: 'Managing', value: 'managing' },
  { label: 'Subscriptions', value: 'subscriptions' },
];

function Page() {
  const router = useRouter();
  const [tab, setTab] = React.useState(tabs[0].value);

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex justify-between items-center">
        <h3 className="hidden md:block capitalize text-xl font-semibold">{tab}</h3>
        <div className="flex gap-2 items-center justify-between w-full md:w-fit">
          <Segment selected={tab} size="sm" items={tabs} onSelect={(item) => setTab(item.value)} />
          <Button icon="icon-plus" variant="secondary" size="sm" onClick={() => router.push('/create/community')} />
        </div>
      </div>

      {match(tab)
        .with('managing', () => <MyHubs />)
        .otherwise(() => (
          <SubcribeHubs />
        ))}
    </div>
  );
}

export default Page;
