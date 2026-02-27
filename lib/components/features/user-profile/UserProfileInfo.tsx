import { User } from '$lib/graphql/generated/backend/graphql';
import { useAccountStats } from '$lib/hooks/useLens';
import { PROFILE_SOCIAL_LINKS } from '$lib/utils/constants';
import { Account } from '@lens-protocol/client';
import { isAddress } from 'viem';
import { twMerge } from 'tailwind-merge';

export function UserProfileInfo({ user, address }: { user: User; address?: string }) {
  const account = isAddress(address) ? ({ address } as Account) : null;
  const { stats } = useAccountStats(account);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className={twMerge('text-2xl font-semibold text-primary')}>{user?.name || user?.display_name}</h3>
        {user?.username && <p className="text-tertiary max-sm:text-sm">{user?.username}</p>}
      </div>

      <p className="text-sm text-secondary">{user?.description}</p>

      <div className="flex gap-3 text-sm">
        <div className="flex gap-1">
          <p>{stats?.followers || 0}</p>
          <p>Followers</p>
        </div>
        <div className="flex gap-1">
          <p>{stats?.following || 0}</p>
          <p>Following</p>
        </div>
        {/* <div className="flex gap-1"> */}
        {/*   <p>{user?.hosted || 0}</p> */}
        {/*   <p>Hosted</p> */}
        {/* </div> */}
      </div>

      <div className="flex items-center gap-3 mt-1">
        {PROFILE_SOCIAL_LINKS.filter((item) => user?.[item.name as keyof User]).map((item) => (
          <div key={item.name} className="tooltip sm:tooltip">
            <div className="tooltip-content">
              <div className="text-sm font-medium">
                <span className="capitalize">{item.name.replace('handle_', '')}</span>:{' '}
                {user?.[item.name as keyof User]}
              </div>
            </div>
            <i
              className={`${item.icon} tooltip tooltip-open cursor-pointer text-tertiary hover:text-primary`}
              onClick={() => window.open(`https://${item.prefix}${user?.[item.name as keyof User]}`, '_blank')}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
