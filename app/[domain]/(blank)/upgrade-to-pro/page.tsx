'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import { Button, Menu, MenuItem } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { GetListMySpacesDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import clsx from 'clsx';
import { generateUrl } from '$lib/utils/cnd';
import { SettingsCommunityDisplay } from '$lib/components/features/community-manage/settings';
import { CommunityPeople } from '$lib/components/features/community-manage/CommunityPeople';
import { PlanAndCredits } from '$lib/components/features/upgrade-to-pro/PlanAndCredits';
import Team from '$lib/components/features/upgrade-to-pro/Team';
import { CommunityDetail } from '$lib/components/features/upgrade-to-pro/CommunityDetail';

const menu: Record<string, { label: string; icon: string; component: React.FC<{ space: Space }> }> = {
  overview: {
    label: 'Community Details',
    icon: 'icon-info',
    component: CommunityDetail,
  },
  people: {
    label: 'Team',
    icon: 'icon-user-group-outline',
    component: Team,
  },
  plans: {
    label: 'Plans & Credits',
    icon: 'icon-credit-card',
    component: PlanAndCredits,
  },
  payouts: {
    label: 'Payouts',
    icon: 'icon-send-money',
    component: () => null,
  },
  domain: {
    label: 'Custom Domain',
    icon: 'icon-globe',
    component: () => null,
  },
  connector: {
    label: 'Connectors',
    icon: 'icon-connector-line',
    component: () => null,
  },
};

function Page() {
  const router = useRouter();
  const me = useMe();

  const [active, setActive] = React.useState('overview');
  const [selectedSpace, setSelectedSpace] = React.useState<Space>();
  const [skip, setSkip] = React.useState(0);

  const { data } = useQuery(GetListMySpacesDocument, {
    variables: { skip, limit: 10 },
    skip: !me,
  });
  const spaces = (data?.listMySpaces?.items || []) as Space[];
  const Comp = menu[active].component;

  React.useEffect(() => {
    setSelectedSpace(spaces[0]);
  }, [spaces.length]);

  return (
    <>
      <Header showUI={false} />
      <div className="h-dvh flex">
        <div className="flex flex-col flex-1 bg-overlay-primary max-w-[280px] p-3 gap-3">
          <Button iconLeft="icon-chevron-left" variant="flat" onClick={() => router.back()} className="w-fit">
            Back
          </Button>

          <Menu.Root placement="bottom-start">
            <Menu.Trigger>
              {() => (
                <MenuItem
                  className="bg-(--btn-tertiary) h-[40px] rounded-sm! max-w-full"
                  iconLeft={
                    <div className="size-5 object-cover aspect-square rounded-xs overflow-hidden bg-tertiary">
                      {selectedSpace?.image_avatar && (
                        <img src={generateUrl(selectedSpace.image_avatar_expanded)} className="w-full h-full" />
                      )}
                    </div>
                  }
                  iconRight="icon-chevron-down"
                >
                  <p className="line-clamp-1 truncate flex-1">{selectedSpace?.title}</p>
                </MenuItem>
              )}
            </Menu.Trigger>
            <Menu.Content className="p-2 w-full">
              {({ toggle }) => (
                <>
                  {spaces.map((item) => (
                    <MenuItem
                      key={item._id}
                      className="max-w-full"
                      iconLeft={
                        <div className="size-5 object-cover aspect-square rounded-xs overflow-hidden bg-tertiary">
                          {item?.image_avatar && (
                            <img src={generateUrl(item.image_avatar_expanded)} className="w-full h-full" />
                          )}
                        </div>
                      }
                      iconRight={item._id === selectedSpace?._id && 'icon-done'}
                      onClick={() => {
                        setSelectedSpace(item);
                        toggle();
                      }}
                    >
                      <p className="line-clamp-1 truncate flex-1 w-full">{item.title}</p>
                    </MenuItem>
                  ))}
                </>
              )}
            </Menu.Content>
          </Menu.Root>

          <p className="p-2.5 text-tertiary text-sm">Settings</p>

          <div className="space-y-0.5">
            {Object.entries(menu).map(([key, item]) => (
              <div
                key={key}
                className={clsx(
                  'flex items-center gap-x-2.5 p-2.5 rounded-sm text-secondary hover:bg-(--btn-tertiary) cursor-pointer',
                  active === key && 'bg-(--btn-tertiary)',
                )}
                onClick={() => setActive(key)}
              >
                <i className={twMerge('w-5 h-5 aspect-square', item.icon)}></i>
                <p className="text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {selectedSpace && (
          <div className="w-full flex-1 overflow-auto no-scrollbar">
            <Comp space={selectedSpace} />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
