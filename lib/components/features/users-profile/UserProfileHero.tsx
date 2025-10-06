'use client';
import { Button, drawer } from '$lib/components/core';
import { User } from '$lib/graphql/generated/backend/graphql';
import { useAccount } from '$lib/hooks/useLens';
import { generateUrl } from '$lib/utils/cnd';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { userAvatar } from '$lib/utils/user';
import clsx from 'clsx';
import { ProfilePane } from '../pane';
import { match } from 'ts-pattern';

interface Props {
  user?: User;
  canEdit?: boolean;
  containerClass?: string;
}
export function UserProfileHero({ user, canEdit, containerClass }: Props) {
  const { account } = useAccount();

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden',
        user?.cover_expanded ? 'h-[154px] md:h-[280px]' : 'h-24 md:h-36',
        containerClass,
      )}
    >
      {!user?.cover_expanded ? (
        <>
          <img
            className="md:hidden aspect-[3.5/1] object-cover rounded-md w-full max-h-2/3"
            loading="lazy"
            src={generateUrl(user?.cover_expanded, {
              resize: { width: 480, fit: 'contain' },
            })}
          />
          <img
            // src={generateUrl(user?.cover_expanded, {
            //   resize: { width: 1080, fit: 'contain' },
            // })}
            src="https://plus.unsplash.com/premium_photo-1701534008693-0eee0632d47a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D"
            loading="lazy"
            className="hidden md:block aspect-[3.5/1] object-cover rounded-md w-full"
          />
        </>
      ) : (
        <div className="absolute inset-0 top-0 left-0 aspect-[3.5/1] object-cover rounded-md w-full bg-blend-darken max-h-2/3 border"></div>
      )}

      <div className="user-dp absolute bottom-1.5 md:bottom-4 size-20 md:size-28 rounded-full overflow-hidden border">
        <img
          className="w-full h-full outline outline-tertiary/4 rounded-md"
          src={account ? account?.metadata?.picture || getAccountAvatar(account) : userAvatar(user)}
        />
      </div>

      <div className="absolute bottom-0 md:bottom-4 right-0">
        <div className="flex items-center gap-3">
          {match(canEdit)
            .with(true, () => (
              <Button iconLeft="icon-edit-sharp" variant="tertiary" size="sm" onClick={() => drawer.open(ProfilePane)}>
                Edit Profile
              </Button>
            ))
            .otherwise(() => (
              <div className="flex items-center gap-2">
                <Button size="sm">Follow</Button>
                <Button icon="icon-heart-outline" size="sm" variant="tertiary-alt"></Button>
                <Button icon="icon-more-horiz" variant="tertiary-alt" size="sm"></Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
