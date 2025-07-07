'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { UseFormReturn } from 'react-hook-form';

import { Card } from '$lib/components/core';
import { LemonHeadsColor, LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { FilterType, TraitType } from '$lib/services/lemonhead/core';
import lemonheads, { BuildQueryParams } from '$lib/trpc/lemonheads';
import { trpc } from '$lib/trpc/client';

import { LemonHeadValues } from '../types';
import { SquareButton, SubContent, SubContentWithTabs } from '../shared';

const skinToneOpts = [
  { value: 'light', label: 'Soft', color: '#FDCCA8' },
  { value: 'tan', label: 'Medium', color: '#E0955F' },
  { value: 'brown', label: 'Rich', color: '#984F1B' },
  { value: 'dark', label: 'Bold', color: '#6C350D' },
];

export function CreateStep({ form, bodySet }: { form: UseFormReturn<LemonHeadValues>; bodySet?: LemonHeadsLayer[] }) {
  const { data } = trpc.lemonheads.colorSet.useQuery();
  const colors = data?.list;

  const [tabs, setTabs] = React.useState({
    skin: { label: 'Skin Tone', icon: '', component: SkinToneItems, mount: true },
    face: { label: 'Face', icon: 'icon-lh-mood', component: FaceItems, mount: false },
    tops: { label: 'Tops', icon: 'icon-lh-tshirt-crew', component: TopItems, mount: false },
    bottom: { label: 'Bottoms', icon: 'icon-lh-pants', component: BottomItems, mount: false },
    outfits: { label: 'Outfits', icon: 'icon-lh-dress', component: OutfitItems, mount: false },
    accessories: { label: 'Accessories', icon: 'icon-lh-glasses-fill', component: AccessoryItems, mount: false },
    footwear: { label: 'Footwear', icon: 'icon-lh-footprint', component: FootwearItems, mount: false },
    background: { label: 'Background', icon: '', component: BackgroundItems, mount: false },
    pets: { label: 'Pets', icon: 'icon-lh-pets', component: PetItems, mount: false },
  });

  const [selected, setSelected] = React.useState('skin');
  const [body, background] = form.watch(['body', 'background']);

  return (
    <div className="flex flex-col md:flex-row-reverse flex-1 w-full md:max-w-[588px] gap-2 overflow-hidden">
      <Card.Root className="flex-1">
        <Card.Content className="p-0 h-full">
          {Object.entries(tabs).map(([key, item]) => {
            if (!item.mount) return null;

            const Comp = item.component;

            return (
              <div key={key} className={clsx('h-full', selected !== key ? 'hidden' : '')}>
                <Comp form={form} bodySet={bodySet} colors={colors} />
              </div>
            );
          })}
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-full md:w-[96px] overflow-auto max-h-fit no-scrollbar">
        <Card.Content className="flex md:flex-col gap-1 p-2">
          {Object.entries(tabs).map(([key, item]) => {
            if (body?.race === 'alien' && key === 'face') return;
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
                {key === 'skin' && (
                  <div
                    className="size-8 rounded-full"
                    style={{ background: skinToneOpts.find((i) => i.value === body?.filters.skin_tone)?.color }}
                  />
                )}
                {key === 'background' && (
                  <div
                    className="size-8 aspect-square rounded-sm"
                    style={{
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundColor: 'var(--color-card-hover)',
                      backgroundImage:
                        background && background.attachment?.length
                          ? `url(${background?.attachment[0].thumbnails.tiny.signedUrl})`
                          : '',
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

function SkinToneItems({ form, bodySet = [] }: { form: UseFormReturn<LemonHeadValues>; bodySet?: LemonHeadsLayer[] }) {
  const body = form.watch('body');

  return (
    <div className="flex md:grid grid-cols-2 text-center gap-3 p-4 overflow-x-auto no-scrollbar">
      {skinToneOpts.map((item) => (
        <div
          key={item.value}
          className="flex flex-col gap-1 min-w-[80px]"
          onClick={() => {
            const attachment = bodySet.find(
              (i) => i.skin_tone === item.value && i.name === body.value && i.size === body.filters.size,
            )?.attachment;

            form.setValue('body.filters.skin_tone', item.value);
            form.setValue('body.attachment', attachment || []);
          }}
        >
          <SquareButton active={body.filters.skin_tone === item.value}>
            <div className="w-full h-full rounded-sm" style={{ background: item.color }} />
          </SquareButton>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

// ---- START FACE ----

function FaceItems({ form, colors = [] }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const [tabs] = React.useState([
    { value: 'eyes', label: 'Eyes', mount: true, component: FaceEyes },
    { value: 'mouth', label: 'Mouth', mount: false, component: FaceMouth },
    { value: 'hair', label: 'Hair', mount: false, component: FaceHair },
    { value: 'facial_hair', label: 'Facial Hair', mount: false, component: FaceFacialHair },
  ]);

  return <SubContentWithTabs tabs={tabs} form={form} colors={colors} />;
}

function FaceEyes({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const body = form.watch('body');
  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.eyes,
    filters: [{ type: FilterType.size, value: body?.filters.size }],
  };

  return (
    <SubContent
      field="eyes"
      form={form}
      where={lemonheads.buildQuery(trait)}
      filters={{ size: body.filters.size }}
      colors={colors}
    />
  );
}

function FaceMouth({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const body = form.watch('body');

  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.mouth,
    filters: [{ type: FilterType.size, value: body?.filters.size }],
  };

  return (
    <SubContent
      field="mouth"
      form={form}
      where={lemonheads.buildQuery(trait)}
      filters={{ size: body.filters.size }}
      colors={colors}
    />
  );
}

function FaceHair({
  form,
  active = false,
  colors = [],
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const [body, hair] = form.watch(['body', 'hair']);
  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.hair,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
      { type: FilterType.color, value: hair?.color },
    ],
  };

  return (
    <SubContent
      field="hair"
      form={form}
      where={lemonheads.buildQuery(trait)}
      filters={{
        size: body?.filters?.size,
        gender: body?.filters?.gender,
        color: hair?.color,
      }}
      colors={colors}
    />
  );
}

function FaceFacialHair({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const [body, facial_hair] = form.watch(['body', 'facial_hair']);
  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.facial_hair,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
      { type: FilterType.color, value: facial_hair?.color },
    ],
  };

  return (
    <SubContent
      field="facial_hair"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{
        size: body?.filters?.size,
        gender: body?.filters?.gender,
        color: facial_hair?.color,
      }}
    />
  );
}

// ---- END FACE ----

function TopItems({ form, colors }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const [body, top] = form.watch(['body', 'top']);

  const trait: BuildQueryParams = {
    type: TraitType.top,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
      { type: FilterType.color, value: top?.color },
    ],
  };

  return (
    <SubContent
      field="top"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{
        gender: body?.filters.gender,
        size: body?.filters.size,
        color: top?.color,
      }}
    />
  );
}

function BottomItems({ form, colors }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const [body, bottom] = form.watch(['body', 'bottom']);

  const trait: BuildQueryParams = {
    type: TraitType.bottom,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
      { type: FilterType.color, value: bottom?.color },
    ],
  };

  return (
    <SubContent
      field="bottom"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{
        gender: body?.filters.gender,
        color: bottom?.color,
        size: body?.filters.size,
      }}
    />
  );
}

function OutfitItems({ form, colors }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const body = form.watch('body');

  const trait: BuildQueryParams = {
    type: TraitType.outfit,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
    ],
  };

  return (
    <SubContent
      field="outfit"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{
        gender: body?.filters.gender,
        size: body?.filters.size,
      }}
    />
  );
}

// ---- START ACCESSORIES ----

function AccessoriesEyeWear({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const [body, eyewear] = form.watch(['body', 'eyewear']);

  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.eyewear,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.color, value: eyewear?.color },
    ],
  };

  return (
    <SubContent
      field="eyewear"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{
        color: eyewear?.color,
        size: body?.filters.size,
      }}
    />
  );
}

function AccessoriesMouthGear({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const body = form.watch('body');

  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.mouthgear,
    filters: [{ type: FilterType.size, value: body?.filters.size }],
  };

  return (
    <SubContent
      field="mouthgear"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{ size: body?.filters.size }}
    />
  );
}

function AccessoriesHeadGear({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const [body, headgear] = form.watch(['body', 'headgear']);

  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.headgear,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
      { type: FilterType.color, value: headgear?.color },
    ],
  };

  return (
    <SubContent
      field="headgear"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{ size: body?.filters.size, gender: body?.filters.gender, color: headgear?.color }}
    />
  );
}

function AccessoriesInstrument({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.instrument,
    filters: [],
  };

  return <SubContent field="instrument" form={form} where={lemonheads.buildQuery(trait)} colors={colors} />;
}

function AccessoriesNecklace({
  form,
  active = false,
  colors,
}: {
  form: UseFormReturn<LemonHeadValues>;
  active?: boolean;
  colors?: LemonHeadsColor[];
}) {
  const [body, necklace] = form.watch(['body', 'necklace']);

  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.necklace,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.color, value: necklace?.color },
    ],
  };

  return (
    <SubContent
      field="necklace"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{ size: body?.filters.size, color: necklace?.color }}
    />
  );
}

function AccessoryItems({ form, colors }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const [tabs] = React.useState([
    { value: 'eyewear', label: 'Eyewear', mount: true, component: AccessoriesEyeWear },
    { value: 'mouthgear', label: 'Mouthgear', mount: true, component: AccessoriesMouthGear },
    { value: 'necklace', label: 'Necklace', mount: true, component: AccessoriesNecklace },
    { value: 'headgear', label: 'Headgear', mount: true, component: AccessoriesHeadGear },
    { value: 'instrument', label: 'Instrument', mount: true, component: AccessoriesInstrument },
  ]);

  return <SubContentWithTabs tabs={tabs} form={form} colors={colors} />;
}

// ---- END ACCESSORIES ----

function FootwearItems({ form, colors }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const [body, footwear] = form.watch(['body', 'footwear']);

  const trait: BuildQueryParams = {
    type: TraitType.footwear,
    filters: [
      { type: FilterType.size, value: body?.filters.size },
      { type: FilterType.gender, value: body?.filters.gender },
      { type: FilterType.color, value: footwear?.color },
    ],
  };

  return (
    <SubContent
      field="footwear"
      form={form}
      where={lemonheads.buildQuery(trait)}
      filters={{ size: body?.filters.size, gender: body?.filters.gender, color: footwear?.color }}
      colors={colors}
    />
  );
}

function BackgroundItem({
  value: artStyle,
  active = false,
  form,
}: {
  active?: boolean;
  value?: string;
  form: UseFormReturn<LemonHeadValues>;
}) {
  if (!active) return null;

  const trait: BuildQueryParams = {
    type: TraitType.background,
    filters: [{ type: FilterType.art_style, value: artStyle }],
  };

  return (
    <SubContent field="background" form={form} where={lemonheads.buildQuery(trait)} filters={{ art_style: artStyle }} />
  );
}

function BackgroundItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [tabs] = React.useState([
    { value: 'cosmic', label: 'Cosmic', mount: true, component: BackgroundItem },
    { value: 'psychedelic', label: 'Psychedelic', mount: false, component: BackgroundItem },
    { value: 'regular', label: 'Regular', mount: false, component: BackgroundItem },
    { value: 'megaETH', label: 'megaETH', mount: false, component: BackgroundItem },
  ]);

  return <SubContentWithTabs tabs={tabs} form={form} />;
}

function PetItems({ form, colors }: { form: UseFormReturn<LemonHeadValues>; colors?: LemonHeadsColor[] }) {
  const pet = form.watch('pet');
  const trait: BuildQueryParams = {
    type: TraitType.pet,
    filters: [
      { type: FilterType.race, value: pet?.race },
      { type: FilterType.color, value: pet?.color },
    ],
  };

  return (
    <SubContent
      field="pet"
      form={form}
      where={lemonheads.buildQuery(trait)}
      colors={colors}
      filters={{ race: pet?.race, color: pet?.color }}
    />
  );
}
