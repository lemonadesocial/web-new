import clsx from 'clsx';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { uniqBy } from 'lodash';
import { isMobile } from 'react-device-detect';
import { LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { trpc } from '$lib/trpc/client';
import { LemonHeadValues } from './types';
import { Skeleton } from '$lib/components/core';
import { unknown } from 'zod';
import { FilterType } from '$lib/services/lemonhead/core';

export function SquareButton({
  className,
  active = false,
  onClick,
  children,
  style,
}: React.PropsWithChildren & {
  className?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={twMerge(
        'border-2 p-1 cursor-pointer rounded-md w-full aspect-square flex justify-center items-center hover:border-quaternary',
        className,
        active && 'border-primary!',
      )}
    >
      {children}
    </div>
  );
}

export function TabsSubContent({
  tabs = [],
  onSelect,
}: {
  tabs: Array<{ value: string; label: string }>;
  onSelect: (tab: string) => void;
}) {
  const [selected, setSelected] = React.useState(tabs?.[0]?.value);
  return (
    <ul className="flex px-4 py-3 sticky top-0 border-b">
      {tabs.map((item) => (
        <li
          key={item.value}
          className="cursor-pointer"
          onClick={() => {
            setSelected(item.value);
            onSelect(item.value);
          }}
        >
          <div
            className={clsx(
              'px-2.5 py-1.5 text-tertiary hover:bg-[var(--btn-tertiary)] rounded-sm font-medium text-sm',
              selected === item.value && 'text-primary bg-[var(--btn-tertiary)]!',
            )}
          >
            {item.label}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Loading({ className }: { className?: string }) {
  return (
    <div className={twMerge('flex md:grid grid-cols-3 gap-3 overflow-auto no-scrollbar', className)}>
      {Array.from({ length: 15 }).map((_, idx) => (
        <Skeleton key={idx} className="w-full min-w-[80px] aspect-square" animate />
      ))}
    </div>
  );
}

export function SubContent({
  limit = 27,
  field,
  where,
  form,
  filters = {},
}: {
  field: string;
  limit?: number;
  where: string;
  filters?: Record<string, string>;
  form: UseFormReturn<LemonHeadValues>;
}) {
  const selected = form.watch(field) as Partial<LemonHeadsLayer>;
  const [offset, setOffSet] = React.useState(0);
  const { data, isLoading: loading } = trpc.lemonheads.layers.useQuery({
    limit: limit,
    offset,
    where,
  });
  const [list, setList] = React.useState<LemonHeadsLayer[]>([]);

  const listInnerRef = React.useRef<any>(null);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 14;

      if (isNearBottom) {
        if (!data?.pageInfo.isLastPage) setOffSet(list.length);
      }
    }
  };

  React.useEffect(() => {
    if (data?.list) {
      const arr = uniqBy([...list, ...data.list], 'Id');
      setList(arr);
    }
  }, [data?.list?.length]);

  React.useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (listInnerElement) {
      listInnerElement.addEventListener('scroll', onScroll);

      return () => {
        listInnerElement.removeEventListener('scroll', onScroll);
      };
    }
  }, [list.length]);

  return (
    <div className="flex flex-col gap-4 md:pb-4 p-4 min-h-[136px]" style={{ height: 'inherit' }}>
      <div ref={listInnerRef} className="flex md:grid grid-cols-3 gap-3 overflow-x-auto no-scrollbar">
        {list.map((item) => (
          <div key={item.Id} className="text-center space-y-1 min-w-[80px]">
            <SquareButton
              active={item.Id === selected?.Id}
              className="flex-col items-stretch"
              onClick={() => {
                if (item.Id === selected?.Id) form.setValue(field, undefined);
                else {
                  form.setValue(field, {
                    Id: item.Id,
                    attachment: item.attachment,
                    value: item.name,
                    type: field,
                    filters,
                  });
                }
              }}
            >
              <img src={item.attachment?.[0]?.thumbnails.card_cover.signedUrl} className="rounded-sm" />
            </SquareButton>
            <p className={clsx('text-sm capitalize truncate', item.Id === selected ? 'text-primary' : 'text-tertiary')}>
              {item.name.replaceAll('_', ' ')}
            </p>
          </div>
        ))}
        {/* {loading && isMobile && <Loading />} */}
      </div>
      {loading && ((isMobile && !list.length) || !isMobile) && <Loading />}
    </div>
  );
}

export function SubContentWithTabs(props: { tabs: any; form: UseFormReturn<LemonHeadValues> }) {
  const body = props.form.watch('body');
  const [tabs, setTabs] = React.useState(props.tabs || []);
  const [currentTab, setCurrentTab] = React.useState(tabs[0].value);

  React.useEffect(() => {
    if (body.filters.gender === 'female') {
      setTabs((prev: any) => prev.filter((i: any) => i.value !== 'facial_hair'));
    }
  }, [body.filters.gender]);

  return (
    <>
      <TabsSubContent
        tabs={tabs}
        onSelect={(tab: string) => {
          setTabs((prev: any) => prev.map((i: any) => (i.value === tab ? { ...i, mount: true } : i)));
          setCurrentTab(tab);
        }}
      />
      <div className="h-full md:pb-14">
        {tabs.map((item: any) => {
          if (!item.mount) return null;
          const Comp = item.component || null;
          return <Comp active={item.value === currentTab} key={item.value} form={props.form} />;
        })}
      </div>
    </>
  );
}
