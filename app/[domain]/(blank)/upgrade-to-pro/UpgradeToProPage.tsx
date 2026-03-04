'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { Button, Menu, MenuItem } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import { GetListMySpacesDocument, GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { generateUrl } from '$lib/utils/cnd';
import {
  getUpgradeToProSection,
  getUpgradeToProSectionHref,
  UPGRADE_TO_PRO_SECTIONS,
  type UpgradeToProSectionKey,
} from '$lib/components/features/upgrade-to-pro/sections';

type UpgradeToProPageProps = {
  activeSection: UpgradeToProSectionKey;
};

function UpgradeToProPage({ activeSection }: UpgradeToProPageProps) {
  const router = useRouter();
  const me = useMe();

  const [selectedSpaceId, setSelectedSpaceId] = React.useState<string | undefined>();
  const [toggleMenuMobile, setToggleMenuMobile] = React.useState(false);

  const activeMenuItem = getUpgradeToProSection(activeSection);
  const ActiveSection = activeMenuItem.render;

  const { data } = useQuery(GetListMySpacesDocument, {
    variables: { skip: 0, limit: 100 },
    skip: !me,
  });
  const spaces = (data?.listMySpaces?.items || []) as Space[];

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, {
    variables: { id: selectedSpaceId },
    skip: !selectedSpaceId,
  });
  const space = dataGetSpace?.getSpace as Space;

  React.useEffect(() => {
    if (spaces.length && !selectedSpaceId) {
      setSelectedSpaceId(spaces[0]._id);
    }
  }, [selectedSpaceId, spaces]);

  return (
    <>
      <Header showUI={false} />
      <div className="h-dvh flex flex-col md:flex-row">
        <div
          className={clsx(
            'md:flex flex-col flex-1 bg-overlay-primary max-w-[280px] p-3 gap-3',
            toggleMenuMobile ? 'max-sm:fixed max-sm:inset-0 max-sm:z-50 max-sm:max-w-full flex' : 'max-sm:hidden',
          )}
        >
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
                      {space?.image_avatar && (
                        <img src={generateUrl(space.image_avatar_expanded)} className="w-full h-full" />
                      )}
                    </div>
                  }
                  iconRight="icon-chevron-down"
                >
                  <p className="line-clamp-1 truncate flex-1">{space?.title}</p>
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
                      iconRight={item._id === selectedSpaceId && 'icon-done'}
                      onClick={() => {
                        setSelectedSpaceId(item._id);
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
            {UPGRADE_TO_PRO_SECTIONS.map((item) => {
              const isActive = activeSection === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={clsx(
                    'w-full flex items-center gap-x-2.5 p-2.5 rounded-sm text-secondary hover:bg-(--btn-tertiary) cursor-pointer',
                    isActive && 'bg-(--btn-tertiary)',
                  )}
                  onClick={() => {
                    setToggleMenuMobile(false);
                    router.push(getUpgradeToProSectionHref(item.key));
                  }}
                >
                  <i className={clsx('w-5 h-5 aspect-square', item.icon)}></i>
                  <p className="text-sm">{item.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="md:hidden p-3 flex justify-between items-center">
          <div className="flex-1">
            <Button
              icon="icon-chevron-left"
              variant="flat"
              onClick={() => setToggleMenuMobile(!toggleMenuMobile)}
              className="w-fit"
            >
              Back
            </Button>
          </div>

          <p className="flex-2 text-center font-bold">{activeMenuItem.label}</p>
          <div className="flex-1" />
        </div>

        {space && (
          <div className="w-full flex-1 overflow-auto no-scrollbar p-4 md:p-12">
            <ActiveSection space={space} />
          </div>
        )}
      </div>
    </>
  );
}

export default UpgradeToProPage;
