'use client';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { useSpaceMenu } from './hooks';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { useAccount } from '$lib/hooks/useLens';

export function Footer({ space }: { space: Space }) {
  const { menu, isActive } = useSpaceMenu({ space, isMobile: true });
  const router = useRouter();
  const me = useMe();
  const { account } = useAccount();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full border-t bg-background/80 backdrop-blur-md z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {menu.map((item) => (
          <div
            key={item.path}
            className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer"
            onClick={() => router.push(`/s/${space.slug || space._id}/${item.path}`)}
          >
            <div
              className={clsx(
                'flex items-center justify-center w-12 h-10 rounded-full transition-colors',
                isActive(item) && 'bg-[var(--btn-secondary)]',
              )}
            >
              <i
                aria-hidden="true"
                className={clsx(
                  'text-xl',
                  item.icon,
                  isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-secondary',
                )}
              />
            </div>
          </div>
        ))}

        {me && (
          <div
            className="flex-1 flex flex-col items-center justify-center h-full cursor-pointer"
            onClick={() => router.push(`/profile/${account?.address || me.username}`)}
          >
            <div className="flex items-center justify-center w-12 h-10 rounded-full">
              <img src={userAvatar(me)} className="size-6 rounded-full" alt={me.name || 'Profile'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
