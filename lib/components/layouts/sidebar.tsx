'use client';
import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
// import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';

import { useMe } from '$lib/hooks/useMe';
import { useAccount } from '$lib/hooks/useLens';
import { userAvatar } from '$lib/utils/user';
import { Accordion, Badge, Button, Card, Divider, modal } from '../core';
import { PostComposerModal } from '../features/lens-feed/PostComposerModal';
import { useQuery } from '$lib/graphql/request';
import { GetHostingEventsSidebarLelfDocument } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { AIChatActionKind, useAIChat } from '../features/ai/provider';
import { aiChat } from '../features/ai/AIChatContainer';
import { delay } from 'lodash';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const me = useMe();
  const { account } = useAccount();
  const [_state, dispatch] = useAIChat();

  const [toggle, setToggle] = React.useState(false);

  const mainMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-home', path: '/', label: 'Home' },
      { icon: 'icon-storefront-outline', path: '/lemonade-stand', label: 'Lemonade Stand' },
      { icon: 'icon-newspaper', path: '/timelines', label: 'Timelines' },
      { icon: 'icon-explore', path: '/explore', label: 'Explore' },
      { icon: 'icon-token', path: '/tokens', label: 'Tokens' },
      // { icon: 'icon-swipe', path: '/swipe', label: 'Swipe & Match' },  // FIXME: add back when lemonheads  are live
      // { icon: 'icon-trophy', path: '/leaderboard', label: 'Leaderboard' },
      { icon: 'icon-passport', path: '/lemonheads', label: 'LemonHeads Zone' },
    ].filter(Boolean);

    return menu;
  }, []);

  const isActive = (item: { path: string }) =>
    pathname === item.path || (item.path.startsWith('/lemonheads') && pathname.includes(item.path));

  const handleNavigate = (path: string) => {
    dispatch({ type: AIChatActionKind.reset });
    router.replace(path);
    aiChat.close();
  };

  return (
    <div
      className={clsx(
        'relative bg-overlay-secondary transition-all duration-300 h-screen text-tertiary border-r max-sm:hidden',
        toggle ? 'w-[240px]' : 'w-[53px]',
      )}
    >
      <div className="p-1.5 flex items-center justify-between">
        <div className="group">
          <div className={clsx('p-2 flex items-center justify-center', !toggle && 'group-hover:hidden')}>
            <i className="icon-lemonade-logo text-warning-300 size-6" />
          </div>
          {!toggle && (
            <button
              className="p-2.5 items-center justify-center cursor-pointer hidden group-hover:flex"
              onClick={() => setToggle(!toggle)}
            >
              <i className="icon-left-panel-close-outline size-5" />
            </button>
          )}
        </div>

        {toggle && (
          <button className="p-2.5 flex items-center justify-center cursor-pointer" onClick={() => setToggle(!toggle)}>
            <i className="icon-left-panel-close-outline size-5" />
          </button>
        )}
      </div>

      <div className="px-1.5">
        {mainMenu.map((item) => (
          <div
            key={item.path}
            className={clsx(
              'cursor-pointer text-secondary p-2.5 flex gap-2.5 items-center hover:bg-(--btn-tertiary) rounded-sm',
              isActive(item) && 'bg-(--btn-tertiary)',
            )}
            onClick={() => handleNavigate(item.path)}
          >
            <i className={twMerge('size-5 aspect-square', item.icon)} />
            {toggle && <span className="text-sm whitespace-nowrap">{item.label}</span>}
          </div>
        ))}

        <div
          className={clsx(
            'cursor-pointer text-secondary p-2.5 flex gap-2.5 items-center hover:bg-(--btn-tertiary) rounded-sm',
          )}
          onClick={() => modal.open(CreatingModal)}
        >
          <i className="size-5 icon-plus aspect-square" />
          {toggle && <span className="text-sm">Create</span>}
        </div>
      </div>

      <div className={clsx(!toggle && 'hidden')}>
        <Divider className="h-1 w-full" />
        <SectionEvents handleNavigate={(path) => handleNavigate(path)} />
      </div>

      {(me || account) && (
        <div className="absolute p-1.5 bottom-0 left-0 right-0 border-t">
          <div className="flex gap-2 items-center p-2">
            <img src={userAvatar(me)} className="rounded-full border aspect-square w-6 h-6" />
            {toggle && (
              <div className="flex flex-col">
                <p className="text-sm font-medium text-secondary">{me?.username || me?.display_name || me?.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const actions = {
  event: { icon: 'icon-ticket text-accent-400', title: 'Event', subtitle: 'Virtual & IRL' },
  community: { icon: 'icon-community text-alert-400', title: 'Community', subtitle: 'Build your space' },
  coin: { icon: 'icon-token text-warning-400', title: 'Coin', subtitle: 'Launch your crypto token' },
  post: { icon: 'icon-edit-square text-[#2DD4BF]!', title: 'Post', subtitle: 'Share updates' },
};

export function CreatingModal() {
  const router = useRouter();

  const handleClick = (key: string) => {
    switch (key) {
      case 'post':
        modal.close();
        modal.open(PostComposerModal, { dismissible: true, fullscreen: isMobile, props: { autoFocus: true } });
        break;

      case 'community':
      case 'event':
      case 'coin':
        router.push(`/create/${key}`);
        modal.close();
        break;

      default:
        break;
    }
  };

  return (
    <Card.Root className="w-full lg:w-[480px] border-none bg-[#202022]">
      <Card.Header className="bg-transparent justify-between w-full flex items-start py-4">
        <Button
          icon="icon-plus size-8"
          size="lg"
          className="rounded-full hover:bg-(--btn-tertiary)! [*]:text-tertiary! max-h-fit! size-[56px]"
          variant="tertiary"
        />
        <Button icon="icon-x" size="xs" className="rounded-full" variant="tertiary" onClick={() => modal.close()} />
      </Card.Header>
      <Card.Content className="flex flex-col gap-4 pt-0">
        <div className="flex flex-col gap-2">
          <p className="text-primary text-lg">Create</p>
          <p className="text-secondary text-sm">What are we creating today?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-2">
          {Object.entries(actions).map(([key, item]) => (
            <Card.Root key={key} className="flex-1" onClick={() => handleClick(key)}>
              <Card.Content className="py-1.5 px-3 md:py-3.5 md:px-4 flex items-center md:items-start md:flex-col gap-3">
                <i className={twMerge('size-5 md:size-8', item.icon)} />
                <div>
                  <p className="text-primary">{item.title}</p>
                  <p className="text-sm text-tertiary">{item.subtitle}</p>
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function SectionEvents({ handleNavigate }: { handleNavigate: (path: string) => void }) {
  const me = useMe();

  const { data } = useQuery(GetHostingEventsSidebarLelfDocument, {
    variables: { limit: 6, user: me?._id },
    skip: !me,
  });
  const events = data?.getHostingEvents || [];

  return (
    <Accordion.Root className="border-none">
      <Accordion.Header chevron={false} className="px-2.5! py-2!">
        {({ isOpen }) => (
          <div className="flex gap-1 items-center">
            <p>Events</p>
            <motion.i
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="icon-chevron-right text-tertiary size-5"
            />
          </div>
        )}
      </Accordion.Header>
      <Accordion.Content className="bg-overlay-secondary p-0! px-1.5!">
        {events.map((item) => (
          <div
            key={item._id}
            className="p-2.5 flex cursor-pointer hover:bg-(--btn-tertiary) rounded-sm text-sm"
            onClick={() => handleNavigate(`/agent/e/manage/${item.shortid}`)}
          >
            <div className="flex gap-2.5 flex-1">
              <div className="size-5 aspect-square rounded-xs bg-tertiary">
                {item.new_new_photos_expanded?.[0] && <img src={generateUrl(item.new_new_photos_expanded?.[0])} />}
              </div>
              <p className="text-secondary line-clamp-1">{item.title}</p>
            </div>
            <Badge className="text-tertiary bg-(--color-card-hover) text-xs rounded-full px-1.5 py-[1px]">
              <i className="icon-draft-outline w-3 h-3 aspect-square" />
              <p>Draft</p>
            </Badge>
          </div>
        ))}

        <div
          className="flex gap-1 items-center text-tertiary text-sm p-2.5 cursor-pointer hover:bg-(--btn-tertiary) rounded-sm"
          onClick={() => handleNavigate('/events')}
        >
          <p className="text-secondary">View All</p>
          <i className="icon-chevron-right size-[18px] aspect-square" />
        </div>
      </Accordion.Content>
    </Accordion.Root>
  );
}

export default Sidebar;
