'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';

import { useMe } from '$lib/hooks/useMe';
import { useAccount } from '$lib/hooks/useLens';
import { userAvatar } from '$lib/utils/user';
import { Avatar, Button, Card, modal } from '../core';
import { PostComposerModal } from '../features/lens-feed/PostComposerModal';

type SidebarItemProps = {
  item: {
    icon: React.ReactNode;
    path: string;
    label: string;
  };
  isActive: (item: { path: string }) => boolean;
};

const SidebarItem = ({ item, isActive }: SidebarItemProps) => {
  return (
    <Link href={item.path} key={item.path}>
      <div className={clsx('w-full', item?.label && 'tooltip tooltip-right')}>
        {item?.label && (
          <div className="tooltip-content">
            <p className="text-md font-medium ">{item?.label}</p>
          </div>
        )}
        <div
          className={clsx(
            'size-16 flex items-center justify-center rounded-md',
            isActive(item) && 'bg-[var(--btn-secondary)]',
          )}
        >
          {typeof item.icon === 'string' ? (
            <i className={clsx(item.icon, isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-tertiary')} />
          ) : (
            item.icon
          )}
        </div>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const me = useMe();
  const { account } = useAccount();

  const mainMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-home', path: '/', label: 'Home' },
      { icon: 'icon-newspaper', path: '/timelines', label: 'Timelines' },
      { icon: 'icon-explore', path: '/explore', label: 'Explore' },
      // { icon: 'icon-swipe', path: '/swipe', label: 'Swipe & Match' },  // FIXME: add back when lemonheads  are live
      // { icon: 'icon-trophy', path: '/leaderboard', label: 'Leaderboard' },
      { icon: 'icon-passport', path: '/lemonheads', label: 'LemonHeads Zone' },
    ];

    return menu;
  }, []);

  const secondaryMenu = useMemo(() => {
    const menu = [
      { icon: 'icon-ticket', path: '/events', label: 'Events' },
      { icon: 'icon-community', path: '/communities', label: 'Communities' },
    ];

    return menu;
  }, []);

  const isActive = (item: { path: string }) =>
    pathname === item.path || (item.path.startsWith('/lemonheads') && pathname.includes(item.path));

  return (
    <div className="hidden lg:block fixed left-0 h-screen border-r z-10">
      <div className="flex flex-col h-full divide-y divide-(--color-divider)">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-center h-12 cursor-pointer" onClick={() => router.push('/')}>
            <i className="icon-lemonade-logo text-[#FDE047]" />
          </div>
          {mainMenu.map((item) => (
            <SidebarItem key={item.path} item={item} isActive={isActive} />
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3 flex-1">
          <div className="flex flex-col flex-1">
            {(me || account) && (
              <>
                <SidebarItem
                  item={{
                    icon: <Avatar src={account?.metadata?.picture || userAvatar(me)} />,
                    path: `/profile/${account?.address || me?.username || me?._id}`,
                    label: 'Profile',
                  }}
                  isActive={isActive}
                />
              </>
            )}

            {secondaryMenu.map((item) => (
              <SidebarItem key={item.path} item={item} isActive={isActive} />
            ))}
          </div>

          <Button icon="icon-plus" className="rounded-full mx-auto" onClick={() => modal.open(CreatingModal)} />

          {(me || account) && (
            <SidebarItem item={{ icon: 'icon-gears', label: 'Settings', path: '/settings' }} isActive={isActive} />
          )}
        </div>
      </div>
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

export default Sidebar;
