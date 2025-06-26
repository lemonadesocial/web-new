import clsx from 'clsx';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { uniqBy } from 'lodash';
import { LemonHeadAccessory } from '$lib/trpc/lemonheads/types';
import { trpc } from '$lib/trpc/client';
import { LemonHeadValues } from './types';

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
        'border-2 p-1 cursor-pointer rounded-md aspect-square flex justify-center items-center hover:border-quaternary',
        className,
        active && 'border-primary!',
      )}
    >
      {children}
    </div>
  );
}

function ListView({
  data = [],
  title,
  onSelect,
  selected,
  id,
}: {
  id?: string;
  data?: LemonHeadAccessory[];
  title?: string;
  selected?: number;
  onSelect: (item: LemonHeadAccessory) => void;
}) {
  return (
    <div id={id} className="flex flex-col gap-4 pb-4">
      {title && <p>{title}</p>}
      <div className="grid grid-cols-3 gap-3">
        {data.map((i) => (
          <div key={i.Id} className="text-center space-y-1">
            <SquareButton active={i.Id === selected} className="flex-col items-stretch" onClick={() => onSelect(i)}>
              <img src={i.attachment?.[0]?.thumbnails.card_cover.signedUrl} className="rounded-sm" />
            </SquareButton>
            <p className={clsx('text-sm', i.Id === selected ? 'text-primary' : 'text-tertiary')}>{i.name}</p>
          </div>
        ))}
      </div>
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
    <ul className="flex px-4 py-3 sticky border-b">
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

function Loading() {
  return <p className="text-center text-tertiary">Loading...</p>;
}

export function SubContent({
  limit = 27,
  selected,
  onSelect,
  where,
}: {
  limit?: number;
  where: string;
  selected?: Partial<LemonHeadAccessory>;
  onSelect: (item: LemonHeadAccessory) => void;
}) {
  const [offset, setOffSet] = React.useState(0);
  const { data, isLoading: loading } = trpc.accessories.useQuery({
    limit: limit,
    offset,
    where,
  });
  const [list, setList] = React.useState<LemonHeadAccessory[]>([]);

  const listInnerRef = React.useRef<any>(null);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

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
    <div ref={listInnerRef} className="p-4 space-y-4 overflow-auto no-scrollbar" style={{ height: 'inherit' }}>
      <ListView data={list} selected={selected?.Id} onSelect={onSelect} />
      {loading && <Loading />}
    </div>
  );
}

export function SubContentWithTabs(props: { tabs: any; form: UseFormReturn<LemonHeadValues> }) {
  const [tabs, setTabs] = React.useState(props.tabs);
  const [currentTab, setCurrentTab] = React.useState(tabs[0].value);

  return (
    <>
      <TabsSubContent
        tabs={tabs}
        onSelect={(tab: string) => {
          setTabs((prev: any) => prev.map((i: any) => (i.value === tab ? { ...i, mount: true } : i)));
          setCurrentTab(tab);
        }}
      />
      <div className="pb-10 h-full">
        {tabs.map((item: any) => {
          if (!item.mount) return null;
          const Comp = item.component || null;
          return <Comp active={item.value === currentTab} key={item.value} form={props.form} />;
        })}
      </div>
    </>
  );
}
