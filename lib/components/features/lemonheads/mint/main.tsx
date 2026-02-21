'use client';
import React from 'react';

import Header from '$lib/components/layouts/header';
import { trpc } from '$lib/trpc/client';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { FilterType } from '$lib/services/lemonhead/core';
import lemonHead from '$lib/trpc/lemonheads';

import { LemonHeadFooter } from './footer';
import { LemonHeadPreview } from './preview';

import { LemonHeadActionKind, LemonHeadProvider, LemonHeadStep, useLemonHeadContext } from './provider';
import { SquareButton } from './shared';
import { Button } from '$lib/components/core';
import { type } from 'os';

export function LemonHeadMain() {
  return (
    <LemonHeadProvider>
      <Content />
    </LemonHeadProvider>
  );
}

const skinToneOpts: Record<string, { value: string; label: string; color: string }[]> = {
  human: [
    { value: 'soft', label: 'Soft', color: '#FDCCA8' },
    { value: 'medium', label: 'Medium', color: '#E0955F' },
    { value: 'rich', label: 'Rich', color: '#984F1B' },
    { value: 'bold', label: 'Bold', color: '#6C350D' },
  ],
  alien: [
    { value: 'soft', label: 'Soft', color: '#D4D9DD' },
    { value: 'medium', label: 'Medium', color: '#A5B3C0' },
    { value: 'rich', label: 'Rich', color: '#788C9E' },
    { value: 'bold', label: 'Bold', color: '#485A6A' },
  ],
};

function Content() {
  const [state, dispatch] = useLemonHeadContext();
  const { data: dataBodySet } = trpc.lemonheads.bodies.useQuery();
  const { data: dataDefaultSet } = trpc.lemonheads.defaultSet.useQuery();
  const { data: dataColorSet } = trpc.lemonheads.colorSet.useQuery();
  const mutation = trpc.lemonheads.random.useMutation();

  React.useEffect(() => {
    const init = async () => {
      if (dataBodySet?.items && dataDefaultSet?.items) {
        const body = await Promise.all(dataBodySet.items.map(lemonHead.trait.tranformTrait));
        dispatch({ type: LemonHeadActionKind.set_resources, payload: { data: body } });

        const accessories = await Promise.all(dataDefaultSet.items.map(lemonHead.trait.tranformTrait));
        dispatch({ type: LemonHeadActionKind.set_resources, payload: { data: accessories } });
        dispatch({
          type: LemonHeadActionKind.set_default_traits,
          payload: { data: { race: 'human', size: 'regular', gender: 'female' } },
        });

        dispatch({ type: LemonHeadActionKind.set_colorset, payload: { data: dataColorSet?.items } });
      }
    };

    init();
  }, [dataBodySet, dataDefaultSet, dataColorSet]);

  const showPreview = !state.steps[state.currentStep].hidePreview;

  const body = state.traits.find((i) => i?.type === 'body');
  const skinTone = body?.filters?.find((i) => i?.type === FilterType.skin_tone)?.value;

  const onShuffle = async () => {
    const baseLayers = state.traits.find((item) => item.type === 'body')?.filters;
    if (baseLayers?.length) {
      const randomData = await mutation.mutateAsync(baseLayers);
      const data = randomData.map((item) => lemonHead.trait.tranformTrait(item));
      dispatch({ type: LemonHeadActionKind.random_traits, payload: { data } });
    }
  };

  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="h-full max-w-full min-xl:aspect-video min-2xl:max-w-[1440px] mx-auto p-4 md:p-11 flex flex-col flex-1 md:h-full">
          <div className="flex flex-col md:flex-row-reverse gap-5 md:gap-8 flex-1 md:h-full">
            {showPreview ? (
              state.currentStep === LemonHeadStep.getstarted ? (
                <div className="md:flex-1">
                  <img
                    src={`${ASSET_PREFIX}/assets/images/lemonheads-getstarted.gif`}
                    className="max-sm:w-[80px] max-md:h-auto rounded-sm aspect-square"
                  />
                </div>
              ) : (
                <div className="md:flex-1 md:w-full max-h-[692px] flex md:flex-col gap-5">
                  <div className="w-[30px] md:hidden" />
                  <div className="grow flex max-h-fit">
                    <LemonHeadPreview
                      className="sm:w-full max-h-fit md:max-h-[688px] max-md:w-full max-md:h-auto md:aspect-square"
                      traits={state.traits}
                    />
                  </div>
                  <div className="w-[30px] md:w-full flex flex-col md:flex-row gap-2 justify-between">
                    <div className="flex flex-col md:flex-row gap-2">
                      {skinToneOpts[body?.value || 'human'].map((item) => (
                        <SquareButton
                          key={item.value}
                          active={item.value === skinTone}
                          className="size-[30px] md:size-[44px] aspect-square"
                          onClick={() => {
                            const data = dataBodySet?.items.find(
                              (i) =>
                                i.skin_tone === item.value &&
                                i.size === body?.filters?.find((i) => i.type === 'size')?.value &&
                                i.gender === body?.filters?.find((i) => i.type === 'gender')?.value &&
                                i.race === body?.filters?.find((i) => i.type === 'race')?.value,
                            );

                            if (data) {
                              dispatch({
                                type: LemonHeadActionKind.set_skintone,
                                payload: { data: lemonHead.trait.tranformTrait(data) },
                              });
                            }
                          }}
                        >
                          <div className="w-full h-full rounded-xs" style={{ background: item.color }} />
                        </SquareButton>
                      ))}
                    </div>

                    {state.currentStep === LemonHeadStep.create && (
                      <>
                        <div className="hidden md:block">
                          <Button size="lg" icon="icon-shuffle" variant="tertiary-alt" onClick={onShuffle} />
                        </div>
                        <div className="md:hidden">
                          <Button size="sm" icon="icon-shuffle" variant="tertiary-alt" onClick={onShuffle} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            ) : null}

            <div className="flex-1 md:min-w-[588px] md:overflow-auto no-scrollbar">
              {Object.entries(state.steps).map(([key, item]) => {
                if (!item.mounted) return null;
                const Comp = item.component || React.Fragment;
                return <Comp key={key} />;
              })}
            </div>
          </div>
        </div>
      </div>

      <LemonHeadFooter />
    </main>
  );
}
