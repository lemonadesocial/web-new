'use client';

import { useParams } from 'next/navigation';
import clsx from 'clsx';

import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { Button, Skeleton } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { isObjectId } from '$lib/utils/helpers';
import Header from '$lib/components/layouts/header';
import { communityAvatar } from '$lib/utils/community';
import React from 'react';
import { CommunityOverview } from '$lib/components/features/community-manage/CommunityOverview';
import { CommunityEvents } from '$lib/components/features/community-manage/CommunityEvents';
import { CommunityPeople } from '$lib/components/features/community-manage/CommunityPeople';
import { CommunityLaunchpad } from '$lib/components/features/community-manage/CommunityLaunchpad';
import { CommunitySettingsLayout } from './CommunitySettingsLayout';
import { AIChatActionKind, useAIChat } from '$lib/components/features/ai/provider';
import { aiChat } from '$lib/components/features/ai/AIChatContainer';
import { mockWelcomeSpace } from '$lib/components/features/ai/InputChat';

const tabs: Record<string, { label: string; component: React.FC<{ space: Space }> }> = {
  overview: { label: 'Overview', component: CommunityOverview },
  events: { label: 'Events', component: CommunityEvents },
  people: { label: 'People', component: CommunityPeople },
  launchpad: { label: 'Launchpad', component: CommunityLaunchpad },
  settings: { label: 'Settings', component: CommunitySettingsLayout },
};

export default function Page() {
  const me = useMe();
  const { uid } = useParams<{ uid: string }>();

  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data, loading } = useQuery(GetSpaceDocument, { variables });

  if (loading) {
    return (
      <div className="font-default">
        <div className="sticky top-0 backdrop-blur-md transition-all duration-300 z-2 pt-7">
          <div className="page mx-auto px-4 md:px-0">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
            <nav className="flex gap-4 pt-1 overflow-auto no-scrollbar">
              {/* {menu.map((item) => ( */}
              {/*   <Skeleton key={item.page} className="h-6 w-20" /> */}
              {/* ))} */}
            </nav>
          </div>
        </div>
        <div className="page mx-auto py-7 px-4 md:px-0">
          <div className="space-y-6">
            <div className="flex gap-2 overflow-auto no-scrollbar">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-32 rounded-md" />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-md" />
              <Skeleton className="h-80 rounded-md" />
            </div>

            <Skeleton className="h-32 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.getSpace) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-alert-outline size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Community Not Found</h1>
            <p className="text-secondary">The community you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button variant="tertiary" onClick={() => (window.location.href = '/')} iconLeft="icon-home">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const space = data?.getSpace as Space;
  const spaceAdmins = space.admins?.map((u) => u._id) || [];
  const canManage = me?._id && [space.creator, ...spaceAdmins].includes(me._id);

  if (!canManage) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 font-default">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
          <div className="w-16 h-16 bg-warning-500/16 rounded-full flex items-center justify-center">
            <i className="icon-lock size-8 text-warning-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">No Access</h1>
            <p className="text-secondary">You don't have access to manage this event.</p>
          </div>
          <Button
            variant="tertiary"
            onClick={() => (window.location.href = `/s/${space.slug || space._id}`)}
            iconRight="icon-chevron-right"
          >
            Community Page
          </Button>
        </div>
      </div>
    );
  }

  return <Content space={space} uid={uid} />;
}

function Content({ space, uid }: { space: Space; uid: string }) {
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [aiChatState, aiChatDispatch] = useAIChat();

  const Comp = tabs[selectedTab].component;

  React.useEffect(() => {
    if (space.slug === uid) {
      aiChatDispatch({ type: AIChatActionKind.reset });
      aiChatDispatch({ type: AIChatActionKind.set_data_run, payload: { data: { space_id: space._id } } });
      aiChatDispatch({ type: AIChatActionKind.add_message, payload: { messages: mockWelcomeSpace(space) } });

      aiChat.open();
    }
  }, []);

  return (
    <main className="flex flex-col h-dvh overflow-auto">
      <Header showUI={false} />
      <div className="px-4 md:px-0 pt-6 sticky top-0 bg-page-background backdrop-blur-3xl z-2 border-b">
        <div className="page mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <img src={communityAvatar(space)} className="size-7 rounded-xs border-card-border" />
              <h1 className="font-semibold text-2xl max-sm:line-clamp-1">{space.title}</h1>
            </div>
            <Button
              iconRight="icon-arrow-outward"
              variant="tertiary-alt"
              size="sm"
              className="hidden md:block"
              onClick={() => window.open(`/s/${uid}`, '_blank')}
            >
              Community Page
            </Button>
            <Button
              icon="icon-arrow-outward"
              className="md:hidden"
              variant="tertiary-alt"
              size="sm"
              onClick={() => window.open(`/s/${uid}`, '_blank')}
            />
          </div>
          <nav className="flex gap-4 pt-3 overflow-auto no-scrollbar">
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
      </div>
      <div className="flex-1">
        <Comp space={space} />
      </div>

      {!aiChatState.toggleChat && (
        <button
          className="sticky bottom-10 left-10 w-14 h-14 aspect-square flex items-center justify-center rounded-full bg-gradient-to-r from-(--btn-tertiary) via-[rgba(255,255,255,0.08)] via-(--color-page-background-overlay) to-(--btn-tertiary) border cursor-pointer group"
          onClick={() => aiChat.open()}
        >
          <i className="icon-lemon-ai text-warning-300 w-8 h-8 aspect-square hover:scale-110  transition-all ease-in-out duration-300" />
        </button>
      )}
    </main>
  );
}
