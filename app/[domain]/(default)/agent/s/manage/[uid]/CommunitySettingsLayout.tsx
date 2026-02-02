'use client';
import React from 'react';
import clsx from 'clsx';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { SettingsCommunityDisplay } from '$lib/components/features/community-manage/settings';
import { SettingsCommunityAvanced } from '$lib/components/features/community-manage/settings/SettingsCommunityAvanced';
import { SettingsCommunityEmbed } from '$lib/components/features/community-manage/settings/SettingsCommunityEmbed';
import { SettingsCommunityTags } from '$lib/components/features/community-manage/settings/SettingsCommunityTags';
import { SettingsCommunityTeam } from '$lib/components/features/community-manage/settings/SettingsCommunityTeam';

const tabs: Record<string, { label: string; component: React.FC<{ space: Space }> }> = {
  display: { label: 'Display', component: SettingsCommunityDisplay },
  team: { label: 'Team', component: SettingsCommunityTeam },
  tags: { label: 'Tags', component: SettingsCommunityTags },
  advanced: { label: 'Advanced', component: SettingsCommunityAvanced },
  embed: { label: 'Embed', component: SettingsCommunityEmbed },
  // send_limit: { label: 'Send Limit', component: null },
  // lemonade_pro: { label: 'Lemonade Pro', component: null },
};

export function CommunitySettingsLayout({ space }: { space: Space }) {
  const [selectedTab, setSelectedTab] = React.useState('display');
  const Comp = tabs[selectedTab].component;

  return (
    <>
      <div className="bg-card sticky top-28 z-2 backdrop-blur-sm">
        <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar">
          {Object.entries(tabs).map(([key, item]) => {
            return (
              <div
                key={key}
                className={clsx('cursor-pointer', key === selectedTab && 'border-b-2 border-b-primary', 'pb-2.5')}
                onClick={() => setSelectedTab(key)}
              >
                <span className={clsx(key === selectedTab ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      <Comp space={space} />
    </>
  );
}
