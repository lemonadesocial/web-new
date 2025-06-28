'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '$lib/components/core';
import { LemonHeadBodyType } from '$lib/trpc/lemonheads/types';

import { LemonHeadValues } from '../types';
import { SquareButton, SubContent, SubContentWithTabs } from '../shared';

export function CreateStep({ form }: { form: UseFormReturn<LemonHeadValues>; bodyBase?: LemonHeadBodyType[] }) {
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
  const [skin_tone, background] = form.watch(['skin_tone', 'background']);

  return (
    <div className="flex flex-col md:flex-row-reverse flex-1 w-full md:max-w-[588px] gap-2 overflow-hidden">
      <Card.Root className="flex-1">
        <Card.Content className="p-0 h-full">
          {Object.entries(tabs).map(([key, item]) => {
            if (!item.mount) return null;

            const Comp = item.component;

            return (
              <div key={key} className={clsx('h-full', selected !== key ? 'hidden' : '')}>
                <Comp form={form} />
              </div>
            );
          })}
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-full md:w-[96px] overflow-auto max-h-fit no-scrollbar">
        <Card.Content className="flex md:flex-col gap-1 p-2">
          {Object.entries(tabs).map(([key, item]) => {
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
                {key === 'skin' && <div className="size-8 rounded-full" style={{ background: skin_tone.color }} />}
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

const skinToneOpts = [
  { value: 'light', label: 'Soft', color: '#FDCCA8' },
  { value: 'tan', label: 'Medium', color: '#E0955F' },
  { value: 'brown', label: 'Rich', color: '#984F1B' },
  { value: 'dark', label: 'Bold', color: '#6C350D' },
];
function SkinToneItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const skin_tone = form.watch('skin_tone');
  return (
    <div className="flex md:grid grid-cols-2 text-center gap-3 p-4 overflow-x-auto no-scrollbar">
      {skinToneOpts.map((item) => (
        <div
          key={item.value}
          className="flex flex-col gap-1 min-w-[80px]"
          onClick={() => form.setValue('skin_tone', { value: item.value, color: item.color })}
        >
          <SquareButton active={skin_tone.value === item.value}>
            <div className="w-full h-full rounded-sm" style={{ background: item.color }} />
          </SquareButton>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

// ---- START FACE ----

function FaceItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [tabs] = React.useState([
    { value: 'eyes', label: 'Eyes', mount: true, component: FaceEyes },
    { value: 'mouth', label: 'Mouth', mount: false, component: FaceMouth },
    { value: 'hair', label: 'Hair', mount: false, component: FaceHair },
    { value: 'facial_hair', label: 'Facial Hair', mount: false, component: FaceFacialHair },
  ]);

  return <SubContentWithTabs tabs={tabs} form={form} />;
}

function FaceEyes({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="eyes" form={form} where={`(type,eq,eyes)~and(body_type,eq,${size})`} />;
}

function FaceMouth({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="mouth" form={form} where={`(type,eq,mouth)~and(body_type,eq,${size})`} />;
}

function FaceHair({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="hair" form={form} where={`(type,eq,hair)~and(body_type,eq,${size})`} />;
}

function FaceFacialHair({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="facial_hair" form={form} where={`(type,eq,facial_hair)~and(body_type,eq,${size})`} />;
}

// ---- END FACE ----

function TopItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [gender, size] = form.watch(['gender', 'size']);

  return (
    <SubContent field="top" form={form} where={`(type,eq,top)~and(gender,eq,${gender})~and(body_type,eq,${size})`} />
  );
}

function BottomItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [gender, size] = form.watch(['gender', 'size']);

  return (
    <SubContent
      field="bottom"
      form={form}
      where={`(type,eq,bottom)~and(gender,eq,${gender})~and(body_type,eq,${size})`}
    />
  );
}

function OutfitItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [gender, size] = form.watch(['gender', 'size']);

  return (
    <SubContent
      field="outfit"
      form={form}
      where={`(type,eq,outfit)~and(gender,eq,${gender})~and(body_type,eq,${size})`}
    />
  );
}

// ---- START ACCESSORIES ----

function AccessoriesEyeWear({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="eyewear" form={form} where={`(type,eq,eyewear)~and(body_type,eq,${size})`} />;
}

function AccessoriesMouthGear({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="mouthgear" form={form} where={`(type,eq,mouthgear)~and(body_type,eq,${size})`} />;
}

function AccessoriesHeadGear({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const size = form.watch('size');
  if (!active) return null;

  return <SubContent field="headgear" form={form} where={`(type,eq,headgear)~and(body_type,eq,${size})`} />;
}

function AccessoryItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [tabs] = React.useState([
    { value: 'eyewear', label: 'Eyewear', mount: true, component: AccessoriesEyeWear },
    { value: 'mouthgear', label: 'Mouthgear', mount: true, component: AccessoriesMouthGear },
    { value: 'headgear', label: 'Headgear', mount: true, component: AccessoriesHeadGear },
  ]);

  return <SubContentWithTabs tabs={tabs} form={form} />;
}

// ---- END ACCESSORIES ----

function FootwearItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const size = form.watch('size');
  return <SubContent field="footwear" form={form} where={`(type,eq,footwear)~and(body_type,eq,${size})`} />;
}

function BackgroundItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  return <SubContent field="background" form={form} where={`(type,eq,background)`} />;
}

function PetItems() {
  return <div className="flex items-center justify-center min-h-[692px]">Coming Soon</div>;
}
