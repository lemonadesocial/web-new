import React from 'react';
import { isMobile } from 'react-device-detect';
import { uniqBy } from 'lodash';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Card, modal, Skeleton } from '$lib/components/core';
import { findConflictTraits, TraitType } from '$lib/services/lemonhead/core';
import { trpc } from '$lib/trpc/client';
import lemonHead from '$lib/trpc/lemonheads';
import { BodyRace, BodySize, Gender, LemonHeadsLayer } from '$lib/trpc/lemonheads/types';

import { CanvasImageRenderer, ColorTool, ConfirmModal, SquareButton } from '../shared';
import { LemonHeadActionKind, LemonHeadStep, useLemonHeadContext } from '../provider';
import { capitalizeWords } from '$lib/utils/string';

export function LemonHeadCreate() {
  const [{ currentStep, traits }] = useLemonHeadContext();
  const body = traits.find((i) => i?.type === TraitType.body);
  const bodyRace = body?.filters?.find((i) => i.type === 'race')?.value;
  const gender = body?.filters?.find((i) => i.type === 'gender')?.value;
  const background = traits.find((i) => i?.type === TraitType.background);

  const [selected, setSelected] = React.useState(bodyRace === 'alien' ? 'top' : 'face');

  const [tabs, setTabs] = React.useState({
    face: {
      label: 'Face',
      icon: 'icon-lh-mood',
      mount: true,
      tabs: [
        { value: 'eyes', label: 'Eyes', mount: true },
        { value: 'mouth', label: 'Mouth', mount: false },
        { value: 'hair', label: 'Hair', mount: false },
        gender === 'male' && { value: 'facial_hair', label: 'Facial Hair', mount: false },
      ],
    },
    top: { label: 'Tops', icon: 'icon-lh-tshirt-crew', mount: bodyRace === 'alien' ? true : false },
    bottom: { label: 'Bottoms', icon: 'icon-lh-pants', mount: false },
    outfit: { label: 'Outfits', icon: 'icon-lh-dress', mount: false },
    accessories: {
      label: 'Accessories',
      icon: 'icon-lh-glasses-fill',
      mount: false,
      tabs: [
        { value: 'eyewear', label: 'Eyewear', mount: true },
        { value: 'mouthgear', label: 'Mouthgear', mount: false },
        { value: 'necklace', label: 'Necklace', mount: false },
        { value: 'headgear', label: 'Headgear', mount: false },
        { value: 'tie', label: 'Tie', mount: false },
        { value: 'bag', label: 'Bag', mount: false },
        { value: 'earrings', label: 'Earrings', mount: false },
      ],
    },
    footwear: { label: 'Footwear', icon: 'icon-lh-footprint', mount: false },
    background: {
      label: 'Background',
      icon: '',
      mount: false,
      tabs: [
        { value: 'cosmic', label: 'Cosmic', mount: true },
        { value: 'psychedelic', label: 'Psychedelic', mount: false },
        { value: 'regular', label: 'Regular', mount: false },
        { value: 'brand_drops', label: 'Brand Drops', mount: false },
      ],
    },
    pet: { label: 'Pets', icon: 'icon-lh-pets', mount: false },
  });

  if (currentStep !== LemonHeadStep.create) return null;

  return (
    <div className="flex flex-col h-full md:flex-row-reverse flex-1 w-full md:w-[588px] gap-2 overflow-hidden">
      <Card.Root className="flex-1">
        <Card.Content className="p-0 h-full">
          {Object.entries(tabs).map(([key, item]) => {
            if (!item.mount) return null;

            return (
              <Content
                key={key}
                className={clsx(selected !== key ? 'hidden' : '')}
                tabs={(item as unknown as any).tabs?.filter(Boolean)}
                layerKey={key as TraitType}
              />
            );
          })}
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-full max-h-fit md:w-[96px] overflow-auto no-scrollbar">
        <Card.Content className="flex md:flex-col gap-1 p-2">
          {Object.entries(tabs).map(([key, item]) => {
            if (body?.value === 'alien' && key === 'face') return;

            return (
              <div
                key={key}
                className={clsx(
                  'flex flex-col items-center justify-center gap-2 pt-3 px-2 pb-2 hover:bg-card-hover rounded-md cursor-pointer min-w-[72px]',
                  key === selected && 'bg-card-hover',
                )}
                onClick={() => {
                  setSelected(key);
                  const _tabs = { ...tabs } as any;
                  if (!_tabs[key].mount) _tabs[key].mount = true;
                  setTabs(_tabs);
                }}
              >
                {key === 'background' && (
                  <div
                    className="size-8 aspect-square rounded-sm"
                    style={{
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundColor: 'var(--color-card-hover)',
                      backgroundImage: background && background.image ? `url(${background.image})` : '',
                    }}
                  />
                )}
                {!['skin', 'background'].includes(key) && <i className={twMerge('size-8', item.icon)} />}
                <p className="text-xs">{item.label}</p>
              </div>
            );
          })}
        </Card.Content>
      </Card.Root>
    </div>
  );
}

function Content({
  tabs: tabList = [],
  layerKey,
  className,
}: {
  tabs?: Array<any>;
  layerKey: TraitType;
  className?: string;
}) {
  const [tabs, setTabs] = React.useState(tabList);

  const [selected, setSelected] = React.useState(tabs[0]?.value || layerKey);

  return (
    <div className={clsx('flex flex-col', className)} style={{ height: 'inherit' }}>
      {!!tabs.length && (
        <>
          <ul className="flex px-4 py-3 sticky top-0 border-b overflow-auto no-scrollbar">
            {tabs.map((item) => (
              <li
                key={item.value}
                className="cursor-pointer"
                onClick={() => {
                  setSelected(item.value);
                  setTabs((prev) => prev.map((i) => (i.value === item.value ? { ...i, mount: true } : i)));
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

          {tabs.map((item) => {
            if (!item.mount) return null;

            return (
              <SubContent
                key={item.value}
                className={clsx('h-full', selected !== item.value && 'hidden')}
                layerKey={
                  ['cosmic', 'psychedelic', 'regular', 'brand_drops'].includes(selected) ? 'background' : selected
                }
                art_style={
                  ['cosmic', 'psychedelic', 'regular', 'brand_drops'].includes(selected) ? selected : undefined
                }
              />
            );
          })}
        </>
      )}

      {!tabs.length && <SubContent className="" layerKey={layerKey} />}
    </div>
  );
}

function Loading({ className, loadMore }: { className?: string; loadMore?: boolean }) {
  if (loadMore) return <p className="text-center">Loading...</p>;
  return (
    <div className={twMerge('flex md:grid grid-cols-3 gap-3 overflow-auto no-scrollbar p-4', className)}>
      {Array.from({ length: 15 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-2">
          <Skeleton className="w-full min-w-[80px] aspect-square" animate />
          <Skeleton className="w-full min-w-[80px] h-4 rounded-xs" animate />
        </div>
      ))}
    </div>
  );
}

function SubContent({
  layerKey,
  art_style,
  className,
}: {
  layerKey: TraitType;
  art_style?: string;
  className?: string;
}) {
  const [page, setPage] = React.useState(1);
  const [list, setList] = React.useState<LemonHeadsLayer[]>([]);

  const listInnerRef = React.useRef<any>(null);

  const [{ traits, colorset }, dispatch] = useLemonHeadContext();
  const body = traits.find((i) => i?.type === TraitType.body);
  const bodySize = body?.filters?.find((i) => i?.type === 'size')?.value;
  const bodyRace = body?.filters?.find((i) => i?.type === 'race')?.value;
  const bodyGender = body?.filters?.find((i) => i?.type === 'gender')?.value;

  const trait = traits.find((i) => i?.type === layerKey);
  const color = trait?.filters?.find((i) => i?.type === 'color')?.value;
  const [selectedColor, setSelectedColor] = React.useState(color);

  const traitFilter = lemonHead.trait.getTraitFilter({
    type: layerKey,
    size: bodySize as BodySize,
    race: layerKey !== 'pet' ? (bodyRace as BodyRace) : undefined,
    gender: bodyGender as Gender,
    color: selectedColor,
    art_style,
  });

  const { data, isLoading, refetch } = trpc.lemonheads.layers.useQuery({
    limit: 27,
    page,
    traits: [traitFilter],
  });

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 14;

      if (isNearBottom) {
        if (data?.total && page * 27 < data?.total) setPage((prev) => prev + 1);
      }
    }
  };

  React.useEffect(() => {
    if (data?.items) {
      const arr = uniqBy([...list, ...data.items], '_id');
      setList(arr);
    }
  }, [data?.items]);

  React.useEffect(() => {
    const listInnerElement = listInnerRef.current;

    if (listInnerElement) {
      listInnerElement.addEventListener('scroll', onScroll);

      return () => {
        listInnerElement.removeEventListener('scroll', onScroll);
      };
    }
  }, [list.length, page]);

  const colors = colorset.find((i) => i.name === layerKey);

  return (
    <div className={twMerge('flex-1 flex flex-col gap-4 overflow-auto no-scrollbar', className)}>
      {!isLoading && !!list.length && (
        <div
          ref={listInnerRef}
          className={clsx(
            'flex md:grid grid-cols-3 gap-3 overflow-x-auto no-scrollbar p-4',
            !isMobile && colors && 'pb-20',
          )}
        >
          {list
            .filter((i) => (i.type === 'background' ? i.art_style === art_style : i.type === layerKey))
            .map((item) => {
              const dt = lemonHead.trait.tranformTrait(item);
              return (
                <SquareButton
                  key={dt._id}
                  label={dt.value}
                  active={dt.value === trait?.value && dt.type === trait?.type}
                  className="min-w-[80px] max-w-[80px] md:max-w-full"
                  onClick={() => {
                    const conflicts = findConflictTraits(traits.filter(Boolean), dt);
                    if (conflicts.length && conflicts.find((i) => i.type !== item.type)) {
                      const conflictStr = conflicts.map((i) => capitalizeWords(i.type)).join(' or ');
                      modal.open(ConfirmModal, {
                        props: {
                          title: `Remove ${conflictStr}?`,
                          subtitle: `Selecting a ${capitalizeWords(item.type)} will remove any ${conflictStr} you have selected. Are you sure you want to continue?`,
                          onConfirm: () => {
                            dispatch({
                              type: LemonHeadActionKind.set_trait,
                              payload: { data: dt, removeConflict: true },
                            });
                          },
                        },
                        dismissible: false,
                      });
                    } else {
                      dispatch({ type: LemonHeadActionKind.set_trait, payload: { data: dt } });
                    }
                  }}
                >
                  {dt.image && <CanvasImageRenderer file={dt.image} style={{ borderRadius: 8 }} />}
                </SquareButton>
              );
            })}
        </div>
      )}

      {isLoading && ((isMobile && !list.length) || !isMobile) && <Loading loadMore={!!list.length} />}

      <ColorTool
        selected={selectedColor}
        colorset={colors}
        onDelete={() => dispatch({ type: LemonHeadActionKind.remove_traits, payload: { data: trait } })}
        onSelect={(params) => {
          setList([]);
          setPage(1);
          const color = params.key !== selectedColor ? params.key : undefined;
          setSelectedColor(color);
          refetch();
        }}
      />
    </div>
  );
}
