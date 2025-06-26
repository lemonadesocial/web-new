'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '$lib/components/core';
import { LemonHeadBodyType } from '$lib/trpc/lemonheads/types';

import { LemonHeadValues } from '../types';
import { SquareButton, SubContent, SubContentWithTabs } from '../shared';

export function CreateStep({
  bodyBase = [],
  form,
}: {
  form: UseFormReturn<LemonHeadValues>;
  bodyBase?: LemonHeadBodyType[];
}) {
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
    <div className="flex w-full gap-2">
      <Card.Root className="max-h-fit">
        <Card.Content className="flex flex-col gap-1 p-2 w-[96px] overflow-auto no-scrollbar">
          {Object.entries(tabs).map(([key, item]) => {
            return (
              <div
                key={key}
                className={clsx(
                  'flex flex-col items-center justify-center gap-2 pt-3 px-2 pb-2 hover:bg-card-hover rounded-md cursor-pointer',
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
                      background:
                        background && background.attachment.length
                          ? `url(${background?.attachment?.[0].signedUrl})`
                          : 'var(--color-card-hover)',
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

      <Card.Root className="flex-1">
        <Card.Content className="p-0">
          {Object.entries(tabs).map(([key, item]) => {
            if (!item.mount) return null;

            const Comp = item.component;

            return (
              <div key={key} className={clsx(selected !== key && 'hidden')}>
                <Comp bodyBase={bodyBase} form={form} />
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
    <div className="grid grid-cols-2 text-center gap-3 p-4">
      {skinToneOpts.map((item) => (
        <div
          key={item.value}
          className="flex flex-col gap-1"
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
  const eyes = form.watch('eyes');
  if (!active) return null;

  return (
    <SubContent
      selected={eyes}
      where="(type,eq,eyes)"
      onSelect={(item) => form.setValue('eyes', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function FaceMouth({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const mouth = form.watch('mouth');
  if (!active) return null;

  return (
    <SubContent
      selected={mouth}
      where="(type,eq,mouth)"
      onSelect={(item) => form.setValue('mouth', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function FaceHair({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const hair = form.watch('hair');
  if (!active) return null;

  return (
    <SubContent
      selected={hair}
      where="(type,eq,hair)"
      onSelect={(item) => form.setValue('hair', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function FaceFacialHair({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const facial_hair = form.watch('facial_hair');
  if (!active) return null;

  return (
    <SubContent
      selected={facial_hair}
      where="(type,eq,facial_hair)"
      onSelect={(item) => form.setValue('facial_hair', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

// ---- END FACE ----

function TopItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const top = form.watch('top');

  return (
    <SubContent
      selected={top}
      where="(type,eq,top)"
      onSelect={(item) => form.setValue('top', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function BottomItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const bottom = form.watch('bottom');

  return (
    <SubContent
      selected={bottom}
      where="(type,eq,bottom)"
      onSelect={(item) => form.setValue('bottom', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function OutfitItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const outfit = form.watch('outfit');

  return (
    <SubContent
      selected={outfit}
      where="(type,eq,outfit)"
      onSelect={(item) => form.setValue('outfit', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

// ---- START ACCESSORIES ----

function AccessoriesEyeWear({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const eyewear = form.watch('eyewear');

  if (!active) return null;

  return (
    <SubContent
      selected={eyewear}
      where="(type,eq,eyewear)"
      onSelect={(item) => form.setValue('eyewear', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function AccessoriesMouthGear({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const mouthgear = form.watch('mouthgear');
  if (!active) return null;

  return (
    <SubContent
      selected={mouthgear}
      where="(type,eq,mouthgear)"
      onSelect={(item) => form.setValue('mouthgear', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function AccessoriesHeadGear({ form, active = false }: { form: UseFormReturn<LemonHeadValues>; active?: boolean }) {
  const headgear = form.watch('headgear');
  if (!active) return null;

  return (
    <SubContent
      selected={headgear}
      where="(type,eq,headgear)"
      onSelect={(item) => form.setValue('headgear', { Id: item.Id, attachment: item.attachment })}
    />
  );
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
  const footwear = form.watch('footwear');

  return (
    <SubContent
      selected={footwear}
      where="(type,eq,footwear)"
      onSelect={(item) => form.setValue('footwear', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function BackgroundItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const background = form.watch('background');

  return (
    <SubContent
      selected={background}
      where="(type,eq,background)"
      onSelect={(item) => form.setValue('background', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function PetItems() {
  return <div className="flex items-center justify-center min-h-[692px]">Coming Soon</div>;
}
