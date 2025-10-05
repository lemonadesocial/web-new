'use client';
import { Button, drawer } from '$lib/components/core';
import { User } from '$lib/graphql/generated/backend/graphql';
import { useAccount } from '$lib/hooks/useLens';
import { generateUrl } from '$lib/utils/cnd';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { userAvatar } from '$lib/utils/user';
import clsx from 'clsx';
import { ProfilePane } from '../pane';

interface Props {
  user?: User;
  canEdit?: boolean;
}
export function UserProfileHero({ user, canEdit }: Props) {
  const { account } = useAccount();

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden',
        user?.cover_expanded ? 'h-[154px] md:h-[280px]' : 'h-24 md:h-36',
      )}
    >
      {user?.cover_expanded ? (
        <>
          <img
            className="md:hidden aspect-[3.5/1] object-cover rounded-md w-full max-h-2/3"
            loading="lazy"
            src={generateUrl(user?.cover_expanded, {
              resize: { width: 480, fit: 'contain' },
            })}
          />
          <img
            src={generateUrl(user?.cover_expanded, {
              resize: { width: 1080, fit: 'contain' },
            })}
            loading="lazy"
            className="hidden md:block aspect-[3.5/1] object-cover rounded-md w-full"
          />
        </>
      ) : (
        <div className="absolute inset-0 top-0 left-0 aspect-[3.5/1] object-cover rounded-md w-full bg-blend-darken"></div>
      )}

      <div className="absolute bottom-1.5 md:bottom-4 size-20 md:size-28 rounded-full overflow-hidden border">
        <img
          className="w-full h-full outline outline-tertiary/4 rounded-md"
          src={account ? account?.metadata?.picture || getAccountAvatar(account) : userAvatar(user)}
        />
      </div>

      <div className="absolute bottom-0 md:bottom-4 right-0">
        <div className="flex items-center gap-3">
          {canEdit && (
            <Button iconLeft="icon-edit-sharp" variant="tertiary" size="sm" onClick={() => drawer.open(ProfilePane)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
