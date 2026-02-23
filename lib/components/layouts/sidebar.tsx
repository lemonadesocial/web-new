'use client';
import React from 'react';
import clsx from 'clsx';
// import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

import { useMe } from '$lib/hooks/useMe';
import { useAccount } from '$lib/hooks/useLens';
import { userAvatar } from '$lib/utils/user';
import { Badge, Button, Menu, MenuItem, Card, Divider, modal, drawer } from '../core';
import { PostComposerModal } from '../features/lens-feed/PostComposerModal';
import { useQuery } from '$lib/graphql/request';
import { GetHostingEventsSidebarLelfDocument } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useLogOut } from '$lib/hooks/useLogout';
import { ProfilePane } from '../features/pane';
import { AIChatActionKind, useAIChat } from '../features/ai/provider';
import { aiChat } from '../features/ai/AIChatContainer';
import { match } from 'ts-pattern';

const Sidebar = () => {
  const pathname = usePathname();
  const [toggle, setToggle] = React.useState<'mini' | 'open'>('mini');
  const router = useRouter();
  const [_state, dispatch] = useAIChat();

  const me = useMe();
  const { account } = useAccount();

  const logOut = useLogOut();
  const signIn = useSignIn();

  const mainMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-home', path: '/', label: 'Home' },
      { icon: 'icon-storefront-outline', path: '/lemonade-stand', label: 'Lemonade Stand' },
      { icon: 'icon-community', path: '/communities', label: 'Community Hubs' },

      // { icon: 'icon-swipe', path: '/swipe', label: 'Swipe & Match' },  // FIXME: add back when lemonheads  are live
      // { icon: 'icon-trophy', path: '/leaderboard', label: 'Leaderboard' },
      // { icon: 'icon-passport', path: '/lemonheads', label: 'LemonHeads Zone' },
    ];

    return menu;
  }, []);

  const exploreMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-explore', path: '/explore', label: 'Discover' },
      { icon: 'icon-token', path: '/tokens', label: 'Coins' },
      { icon: 'icon-newspaper', path: '/timelines', label: 'Newsfeed' },
    ];
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
    <>
      <div className="md:hidden fixed z-50 top-0 bg-background left-0 right-0 p-2.5">
        <button
          className="text-tertiary p-2.5 flex justify-center cursor-pointer"
          onClick={() => setToggle((prev) => (prev !== 'open' ? 'open' : 'mini'))}
        >
          <i className="icon-left-panel-close-outline size-5" />
        </button>
      </div>

      {toggle === 'open' && (
        <div
          className="fixed bg-(--color-page-background-overlay) inset-0 z-50 md:hidden"
          onClick={() => setToggle('mini')}
        />
      )}

      <div
        className={clsx(
          'relative bg-overlay-primary h-screen text-tertiary border-r z-50 transform transition-transform duration-300 ease-in-out',
          toggle === 'mini' && 'border-r-0 max-sm:-translate-x-full',
          toggle === 'open' && 'max-sm:fixed max-sm:left-0',
        )}
      >
        <div
          className={clsx(
            'flex flex-col h-full transition-all duration-300',
            toggle === 'open' && 'w-64',
            toggle === 'mini' && 'w-16 max-sm:hidden',
          )}
        >
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 flex items-center justify-between">
              <div className="group">
                <div
                  className={clsx('p-2 flex items-center justify-center', toggle === 'mini' && 'group-hover:hidden')}
                >
                  <i className="icon-lemonade-logo text-warning-300 size-6" />
                </div>
                {toggle === 'mini' && (
                  <button
                    className="p-2.5 items-center justify-center cursor-pointer hidden group-hover:flex"
                    onClick={() => setToggle((prev) => (prev === 'mini' ? 'open' : 'mini'))}
                  >
                    <i aria-hidden="true" className="icon-left-panel-close-outline size-5" />
                  </button>
                )}
              </div>

              {toggle === 'open' && (
                <button
                  className="p-2.5 flex items-center justify-center cursor-pointer"
                  onClick={() => setToggle((prev) => (prev === 'mini' ? 'open' : 'mini'))}
                >
                  <i aria-hidden="true" className="icon-left-panel-close-outline size-5" />
                </button>
              )}
            </div>

            <div className="px-3 pb-3 flex flex-col gap-1">
              {mainMenu.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'cursor-pointer text-secondary p-2.5 flex gap-2.5 items-center hover:bg-(--btn-tertiary) rounded-sm',
                    isActive(item) && 'bg-(--btn-tertiary)',
                  )}
                  onClick={() => handleNavigate(item.path)}
                >
                  <i className={twMerge('size-5 aspect-square', item.icon)} />
                  {toggle === 'open' && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </div>
              ))}

              <div
                className={clsx(
                  'cursor-pointer text-secondary p-2.5 flex gap-2.5 items-center hover:bg-(--btn-tertiary) rounded-sm',
                )}
                onClick={() => modal.open(CreatingModal)}
              >
                <i className="size-5 icon-plus aspect-square" />
                {toggle === 'open' && <span className="text-sm">Create</span>}
              </div>
            </div>

            <div className="px-3 pb-3 flex flex-col gap-1">
              <div className={clsx('text-tertiary text-sm p-2.5 pb-1.5', toggle === 'mini' && 'invisible')}>
                <p>Explore</p>
              </div>
              {exploreMenu.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'cursor-pointer text-secondary p-2.5 flex gap-2.5 items-center hover:bg-(--btn-tertiary) rounded-sm',
                    isActive(item) && 'bg-(--btn-tertiary)',
                  )}
                  onClick={() => handleNavigate(item.path)}
                >
                  <i className={twMerge('size-5 aspect-square', item.icon)} />
                  {toggle === 'open' && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </div>
              ))}
            </div>

            <div className={clsx('flex-1 pb-2 overflow-hidden', toggle === 'mini' && 'hidden')}>
              <Divider className="h-1 w-full" />
              {toggle === 'open' && <SectionEvents handleNavigate={(path) => handleNavigate(path)} />}
            </div>
          </div>

          <div className="border-t p-3 pt-4 flex flex-col gap-3">
            <Card.Root
              className={clsx(
                'border-none hover:bg-(--btn-tertiary)',
                toggle ? 'bg-(--btn-tertiary)' : 'bg-transparent',
              )}
            >
              <Card.Content
                className={clsx('flex justify-between items-center', toggle === 'open' ? 'px-3 py-2 gap-3' : 'p-2.5')}
              >
                {match(toggle)
                  .with('open', () => (
                    <>
                      <div>
                        <p className="text-sm">Rewards</p>
                        <p className="text-quaternary text-xs">Earn credits for your hubs</p>
                      </div>
                      <div className="p-2 bg-warning-600 rounded-full w-[30px] h-[30px] aspect-square flex items-center justify-center">
                        <i className="icon-gift-line w-4 h-4" />
                      </div>
                    </>
                  ))
                  .with('mini', () => <i className="icon-gift-line size-5 aspect-square" />)
                  .otherwise(() => null)}
              </Card.Content>
            </Card.Root>

            <Card.Root
              className={clsx(
                'border-none hover:bg-(--btn-tertiary)',
                toggle ? 'bg-(--btn-tertiary)' : 'bg-transparent',
              )}
              onClick={() => {
                if (me || account) {
                  router.push('/upgrade-to-pro');
                } else {
                  signIn();
                }
              }}
            >
              <Card.Content
                className={clsx('flex justify-between items-center', toggle === 'open' ? 'px-3 py-2 gap-3' : 'p-2.5')}
              >
                {match(toggle)
                  .with('open', () => (
                    <>
                      <div>
                        <p className="text-sm">Upgrade to Pro</p>
                        <p className="text-quaternary text-xs">Unlock more benefits</p>
                      </div>
                      <div className="p-2 bg-alert-500 rounded-full w-[30px] h-[30px] aspect-square flex items-center justify-center">
                        <i className="icon-flash w-4 h-4" />
                      </div>
                    </>
                  ))
                  .with('mini', () => <i className="icon-flash size-5 aspect-square" />)
                  .otherwise(() => null)}
              </Card.Content>
            </Card.Root>

            {me || account ? (
              <Menu.Root strategy="absolute" placement="top-start">
                <Menu.Trigger>
                  {() => (
                    <div className="flex gap-2 items-center p-2">
                      <img src={userAvatar(me)} className="rounded-full border aspect-square w-6 h-6" />
                      {toggle === 'open' && (
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-secondary">
                            {me?.username || me?.display_name || me?.name}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-0 min-w-[228px] backdrop-blur-md!">
                  {({ toggle }) => (
                    <>
                      <div className="p-1">
                        <MenuItem
                          title="Edit Profile"
                          onClick={() => drawer.open(ProfilePane, { dismissible: false })}
                        />
                        <MenuItem title="Settings" onClick={() => router.push('/settings')} />
                        <MenuItem
                          title="Sign Out"
                          onClick={async () => {
                            toggle();
                            logOut();
                          }}
                        />
                      </div>
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>
            ) : (
              <div
                className="flex gap-2 items-center p-2 cursor-pointer hover:bg-(--btn-tertiary) rounded-sm"
                onClick={() => signIn()}
              >
                <img src={userAvatar(me)} className="rounded-full border aspect-square w-6 h-6" />
                {toggle === 'open' && (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-secondary">Login</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
                <i aria-hidden="true" className={twMerge('size-5 md:size-8', item.icon)} />
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
  const [hasMore, setHasMore] = React.useState(true);

  const { data, fetchMore } = useQuery(GetHostingEventsSidebarLelfDocument, {
    variables: { limit: 15, user: me?._id, skip: 0 },
    skip: !me,
  });
  const events = data?.getHostingEvents || [];

  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
      fetchMore({
        variables: { skip: events.length },
        updateQuery: (existing, res) => {
          if (res?.getHostingEvents?.length) {
            return {
              __typename: 'Query',
              getHostingEvents: [...(existing?.getHostingEvents || []), ...res?.getHostingEvents],
            };
          }
          if (res.getHostingEvents.length === 0) setHasMore(false);
          return existing;
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 flex items-center justify-between p-2.5 pb-1.5">
        <p>Events</p>
        <i
          className="icon-arrow-outward text-quaternary hover:text-primary cursor-pointer size-5"
          onClick={() => handleNavigate('/events')}
        />
      </div>
      <div ref={containerRef} onScroll={handleScroll} className="px-3 flex-1 overflow-auto">
        {events.map((item) => (
          <div
            key={item._id}
            className="p-2.5 flex cursor-pointer hover:bg-(--btn-tertiary) rounded-sm text-sm"
            onClick={() => handleNavigate(`/agent/e/manage/${item.shortid}`)}
          >
            <div className="flex gap-2.5 flex-1">
              <div className="size-5 aspect-square rounded-xs bg-tertiary">
                {item.new_new_photos_expanded?.[0] && (
                  <img
                    src={generateUrl(item.new_new_photos_expanded?.[0])}
                    className="object-contain w-full h-full rounded-xs"
                  />
                )}
              </div>
              <p className="text-secondary line-clamp-1">{item.title}</p>
            </div>
            <Badge className="text-tertiary bg-(--color-card-hover) text-xs rounded-full px-1.5 py-[1px]">
              <i aria-hidden="true" className="icon-draft-outline w-3 h-3 aspect-square" />
              <p>Draft</p>
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
