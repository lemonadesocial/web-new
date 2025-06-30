'use client';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { transformTrait } from '$lib/trpc/lemonheads/preselect';

import { LemonHeadValues } from '../types';
import { SquareButton } from '../shared';
import { LemonHeadPreview } from '../preview';
import { size } from 'lodash';

const BodyTypeMapping = { medium: 'Regular', small: 'Skinny', large: 'Toned', extra_large: 'Large' };
const customOrder = {
  medium: 0, // Medium is rank 0 (first)
  large: 1, // Large is rank 1 (second)
  small: 2, // Small is rank 3 (third)
  extra_large: 3, // Extra_large is rank 3 (fourth)
};

export function AboutYou({
  form,
  bodySet,
  defaultSet = [],
}: {
  form: UseFormReturn<LemonHeadValues>;
  bodySet: LemonHeadsLayer[];
  defaultSet?: LemonHeadsLayer[];
}) {
  const body = form.watch('body');
  const formValues = form.watch();

  const human = bodySet.find(
    (i) =>
      i.gender === body.filters.gender &&
      i.name === 'human' &&
      i.skin_tone === body.filters.skin_tone &&
      i.size === (body.filters.gender === 'male' ? 'medium' : 'small'),
  );

  const alien = bodySet.find((i) => i.gender === body.filters.gender && i.name === 'alien' && i.size === 'medium');

  const assets = bodySet
    .filter((i) => i.gender === body.filters.gender && i.name === body.value && i.skin_tone === body.filters.skin_tone)
    .sort((a, b) => {
      const rankA = customOrder[a.size] ?? Infinity;
      const rankB = customOrder[b.size] ?? Infinity;
      return rankA - rankB;
    });
  return (
    <div className="flex-1 max-w-[588px] flex flex-col gap-8">
      <div className="hidden md:flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Build Your Base</h3>
        <p className="text-tertiary">Choose your gender, species & body type.</p>
      </div>

      <div className="flex flex-col gap-3">
        <p>Pick your persona</p>
        <div className="grid grid-cols-5 gap-3">
          <div className="grid grid-rows-2 gap-3">
            <SquareButton
              active={body.filters.gender === 'female'}
              onClick={() => {
                form.reset();
                form.setValue('body.filters.gender', 'female');
              }}
            >
              <i className="icon-lh-female size-10 text-[#F270A4]" />
            </SquareButton>

            <SquareButton
              active={body.filters.gender === 'male'}
              onClick={() => {
                form.reset();
                form.setValue('body.filters.gender', 'male');
              }}
            >
              <i className="icon-lh-male size-10 text-[#70A4FE]" />
            </SquareButton>
          </div>
          <SquareButton
            className="col-span-2"
            active={body.value === 'human'}
            onClick={() => form.setValue('body.value', 'human')}
          >
            <LemonHeadPreview
              className="w-full rounded-sm"
              form={{
                ...formValues,
                ...transformTrait({ data: defaultSet, gender: body.filters.gender, size: human?.size }),
                body: {
                  ...formValues.body,
                  value: 'human',
                  attachment: human?.attachment,
                  filters: { ...formValues.body.filters, size: human?.size },
                },
              }}
              bodySet={bodySet}
            />
          </SquareButton>
          <SquareButton
            className="col-span-2"
            active={body.value === 'alien'}
            onClick={() => form.setValue('body.value', 'alien')}
          >
            <LemonHeadPreview
              className="w-full rounded-sm"
              form={{
                ...formValues,
                ...transformTrait({ data: defaultSet, gender: body.filters.gender, size: alien?.size }),
                body: {
                  ...formValues.body,
                  value: 'alien',
                  attachment: alien?.attachment,
                  filters: { ...formValues.body.filters, size: alien?.size },
                },
              }}
              bodySet={bodySet}
            />
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
                onClick={() => {
                  form.reset({
                    ...transformTrait({ data: defaultSet, gender: body.filters.gender, size: item?.size }),
                    body: {
                      ...body,
                      filters: { ...body.filters, size: item.size },
                      attachment: item.attachment,
                    },
                  });
                  // form.setValue('body', {});
                }}
                active={item.size === body.filters.size}
              >
                <LemonHeadPreview
                  className="w-full rounded-sm"
                  form={{
                    ...formValues,
                    ...transformTrait({ data: defaultSet, gender: item.gender, size: item.size }),
                    body: {
                      ...formValues.body,
                      filters: { ...formValues.body.filters, size: item.size },
                      attachment: item.attachment,
                    },
                  }}
                  bodySet={assets}
                />
              </SquareButton>
              <p>{BodyTypeMapping[item.size]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
