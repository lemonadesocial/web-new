'use client';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Image } from '$lib/components/core/image';
import { LemonHeadAccessory, LemonHeadBodyType } from '$lib/trpc/lemonheads/types';
import { trpc } from '$lib/trpc/client';

import { LemonHeadValues } from '../types';
import { SquareButton } from '../shared';

const BodyTypeMapping = { medium: 'Regular', small: 'Skinny', large: 'Toned', extra_large: 'Larger' };
const customOrder = {
  medium: 0, // Medium is rank 0 (first)
  large: 1, // Large is rank 1 (second)
  small: 2, // Small is rank 3 (third)
  extra_large: 3, // Extra_large is rank 3 (fourth)
};

export function AboutYou({ form, bodyBase }: { form: UseFormReturn<LemonHeadValues>; bodyBase: LemonHeadBodyType[] }) {
  const [gender, size, body, skin_tone] = form.watch(['gender', 'size', 'body', 'skin_tone']);

  const { data } = trpc.preselect.useQuery({ size, gender });

  React.useEffect(() => {
    if (data) Object.entries(data).forEach(([key, value]) => form.setValue(key, value));
  }, [data]);

  const condition = (i: LemonHeadBodyType) =>
    i.gender === gender && i.body_type === size && i.skin_tone === skin_tone.value;

  const human = bodyBase.find((i) => condition(i) && i.name === 'human');
  const alien = bodyBase.find((i) => condition(i) && i.name === 'alien');
  const assets = bodyBase
    .filter((i) => i.gender === gender && i.name === body && i.skin_tone === skin_tone.value)
    .sort((a, b) => {
      const rankA = customOrder[a.body_type] ?? Infinity;
      const rankB = customOrder[b.body_type] ?? Infinity;
      return rankA - rankB;
    });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Build Your Base</h3>
        <p className="text-tertiary">Choose your gender, species & body type.</p>
      </div>

      <div className="flex flex-col gap-3">
        <p>Pick your persona</p>
        <div className="grid grid-cols-5 gap-3">
          <div className="grid grid-rows-2 gap-3">
            <SquareButton
              active={gender === 'female'}
              onClick={() => {
                form.reset();
                form.setValue('gender', 'female');
              }}
            >
              <i className="icon-lh-female size-10 text-[#F270A4]" />
            </SquareButton>

            <SquareButton
              active={gender === 'male'}
              onClick={() => {
                form.reset();
                form.setValue('gender', 'male');
              }}
            >
              <i className="icon-lh-male size-10 text-[#70A4FE]" />
            </SquareButton>
          </div>
          <SquareButton className="col-span-2" active={body === 'human'} onClick={() => form.setValue('body', 'human')}>
            <Image src={human?.attachment[0]?.signedUrl} lazy />
          </SquareButton>
          <SquareButton className="col-span-2" active={body === 'alien'} onClick={() => form.setValue('body', 'alien')}>
            <Image src={alien?.attachment[0]?.signedUrl} lazy />
          </SquareButton>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p>Choose your frame</p>
        <div className="grid grid-cols-4 gap-3">
          {assets.map((item) => (
            <div key={item.Id} className="flex flex-col gap-1 items-center">
              <SquareButton
                className="flex-1"
                onClick={() => form.setValue('size', item.body_type)}
                active={item.body_type === size}
              >
                <Image src={item.attachment[0].thumbnails.card_cover.signedUrl} lazy />
              </SquareButton>

              <p>{BodyTypeMapping[item.body_type]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
