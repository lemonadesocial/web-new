import clsx from 'clsx';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { uniqBy } from 'lodash';
import { isMobile } from 'react-device-detect';

import { LemonHeadsColor, LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { trpc } from '$lib/trpc/client';
import { LemonHeadValues } from './types';
import { Button, Card, modal, Skeleton } from '$lib/components/core';
import { TraitType } from '$lib/services/lemonhead/core';

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

function Loading({ className, loadMore }: { className?: string; loadMore?: boolean }) {
  if (loadMore) return <p className="text-center">Loading...</p>;
  return (
    <div className={twMerge('flex md:grid grid-cols-3 gap-3 overflow-auto no-scrollbar', className)}>
      {Array.from({ length: 15 }).map((_, idx) => (
        <Skeleton key={idx} className="w-full min-w-[80px] aspect-square" animate />
      ))}
    </div>
  );
}

export function ColorTool({
  selected,
  colorset,
  onSelect,
}: {
  selected?: string;
  colorset?: LemonHeadsColor;
  onSelect: (params: { key: string; value: string }) => void;
}) {
  const colors = colorset?.value || [];

  return (
    <Card.Root className="absolute left-4 bottom-4 max-h-[52px] rounded-full p-3 bg-overlay-secondary">
      <Card.Content className="p-0 flex gap-1 rounded-full">
        {colors.map((c) => (
          <div
            key={c.value}
            onClick={() => onSelect(c)}
            className={clsx(
              'w-[28px] h-[28px] aspect-square flex items-center justify-center rounded-full border-2 cursor-pointer hover:bg-(--btn-tertiary)',
              selected === c.key ? 'border-primary' : 'border-transparent',
            )}
          >
            <div className="w-[20px] h-[20px] rounded-full aspect-square" style={{ background: c.value }} />
          </div>
        ))}
      </Card.Content>
    </Card.Root>
  );
}

export function SubContent({
  limit = 27,
  field,
  where,
  form,
  filters = {},
  colors = [],
}: {
  field: string;
  limit?: number;
  where: string;
  filters?: Record<string, string | undefined>;
  form: UseFormReturn<LemonHeadValues>;
  colors?: LemonHeadsColor[];
}) {
  const selected = form.watch(field) as Partial<LemonHeadsLayer>;
  const [offset, setOffSet] = React.useState(0);

  const formValues = form.watch();

  const [condition, setCondition] = React.useState(where);
  const [selectedColor, setSelectedColor] = React.useState(formValues[field]?.color);

  const {
    data,
    isLoading: loading,
    refetch,
  } = trpc.lemonheads.layers.useQuery({
    limit: limit,
    offset,
    where: condition,
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
  }, [data?.list]);

  React.useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (listInnerElement) {
      listInnerElement.addEventListener('scroll', onScroll);

      return () => {
        listInnerElement.removeEventListener('scroll', onScroll);
      };
    }
  }, [list.length]);

  const colorset = colors?.find((i) => i.name === field);

  return (
    <>
      <div
        className={clsx('flex flex-col gap-4 md:pb-4 p-4 min-h-[136px]', !!colorset && 'pb-20!')}
        style={{ height: 'inherit' }}
      >
        <div ref={listInnerRef} className="flex md:grid grid-cols-3 gap-3 overflow-x-auto no-scrollbar">
          {list.map((item) => (
            <div key={item.Id} className="text-center space-y-1 min-w-[80px]">
              <SquareButton
                active={item.Id === selected?.Id}
                className="flex-col items-stretch"
                onClick={() => {
                  if (item.Id === selected?.Id) form.setValue(field, undefined);
                  else {
                    if (field === 'outfit' && (formValues.top || formValues.bottom)) {
                      modal.open(ConfirmModal, {
                        props: {
                          title: 'Remove Bottom and Top?',
                          subtitle:
                            'Selecting an outfit will remove any tops or bottoms you have selected. Are you sure you want to continue?',
                          onConfirm: () => {
                            form.setValue('top', undefined);
                            form.setValue('bottom', undefined);

                            form.setValue('outfit', {
                              Id: item.Id,
                              attachment: item.attachment,
                              value: item.name,
                              type: field as TraitType,
                              color: item.color,
                              race: item.race,
                              filters,
                            });
                          },
                        },
                      });
                      return;
                    }

                    if (['top', 'bottom'].includes(field) && formValues.outfit) {
                      modal.open(ConfirmModal, {
                        props: {
                          title: 'Remove Outfit?',
                          subtitle:
                            'Selecting a top or bottom will remove any outfits you have selected. Are you sure you want to continue?',
                          onConfirm: () => {
                            form.setValue('outfit', undefined);

                            form.setValue(field, {
                              Id: item.Id,
                              attachment: item.attachment,
                              value: item.name,
                              type: field as TraitType,
                              color: item.color,
                              race: item.race,
                              filters,
                            });
                          },
                        },
                      });

                      return;
                    }

                    form.setValue(field, {
                      Id: item.Id,
                      attachment: item.attachment,
                      value: item.name,
                      type: field as TraitType,
                      color: item.color,
                      race: item.race,
                      filters,
                    });
                  }
                }}
              >
                <img src={item.attachment?.[0]?.thumbnails.card_cover.signedUrl} className="rounded-sm" />
              </SquareButton>
              <p
                className={clsx('text-sm capitalize truncate', item.Id === selected ? 'text-primary' : 'text-tertiary')}
              >
                {item.name.replaceAll('_', ' ')}
              </p>
            </div>
          ))}
          {/* {loading && isMobile && <Loading />} */}
        </div>
        {loading && ((isMobile && !list.length) || !isMobile) && <Loading loadMore={!!list.length} />}
      </div>

      {colorset && !isMobile && (
        <ColorTool
          selected={selectedColor}
          colorset={colorset}
          onSelect={(params) => {
            setList([]);
            if (params.key !== selectedColor) {
              setSelectedColor(params.key);
              if (condition.includes(`~and(color,eq,${selectedColor})`)) {
                setCondition((prev) => prev.replace(`~and(color,eq,${selectedColor})`, `~and(color,eq,${params.key})`));
              } else {
                setCondition((prev) => (prev += `~and(color,eq,${params.key})`));
              }
            } else {
              setSelectedColor(undefined);
              setCondition((prev) => prev.replace(`~and(color,eq,${params.key})`, ''));
            }
            refetch();
          }}
        />
      )}
    </>
  );
}

export function SubContentWithTabs(props: {
  tabs: any;
  form: UseFormReturn<LemonHeadValues>;
  colors?: LemonHeadsColor[];
}) {
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
          return <Comp active={item.value === currentTab} key={item.value} form={props.form} colors={props.colors} />;
        })}
      </div>
    </>
  );
}

export function ConfirmModal({
  title,
  subtitle,
  onConfirm,
}: {
  onConfirm: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-info text-danger-400" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm font-medium text-secondary">{subtitle}</p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={() => {
            modal.close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => {
            modal.close();
            onConfirm();
          }}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
