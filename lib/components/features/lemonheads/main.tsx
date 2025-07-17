'use client';
import React from 'react';
import clsx from 'clsx';

import Header from '$lib/components/layouts/header';
import { trpc } from '$lib/trpc/client';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { FilterType } from '$lib/services/lemonhead/core';
import lemonHead from '$lib/trpc/lemonheads';

import { LemonHeadFooter } from './footer';
import { LemonHeadPreview } from './preview';

import { LemonHeadActionKind, LemonHeadProvider, LemonHeadStep, useLemonHeadContext } from './provider';
import { SquareButton } from './shared';

export function LemonHeadMain() {
  return (
    <LemonHeadProvider>
      <Content />
    </LemonHeadProvider>
  );
}

const skinToneOpts: any = {
  human: [
    { value: 'light', label: 'Soft', color: '#FDCCA8' },
    { value: 'tan', label: 'Medium', color: '#E0955F' },
    { value: 'brown', label: 'Rich', color: '#984F1B' },
    { value: 'dark', label: 'Bold', color: '#6C350D' },
  ],
  alien: [
    { value: 'light', label: 'Soft', color: '#D4D9DD' },
    { value: 'tan', label: 'Medium', color: '#A5B3C0' },
    { value: 'brown', label: 'Rich', color: '#788C9E' },
    { value: 'dark', label: 'Bold', color: '#485A6A' },
  ],
};

function Content() {
  const [state, dispatch] = useLemonHeadContext();
  const { data: dataBodySet } = trpc.lemonheads.bodies.useQuery();
  const { data: dataDefaultSet } = trpc.lemonheads.defaultSet.useQuery();
  const { data: dataColorSet } = trpc.lemonheads.colorSet.useQuery();

  React.useEffect(() => {
    const init = async () => {
      if (dataBodySet?.items && dataDefaultSet?.items) {
        const body = await Promise.all(dataBodySet.items.map(lemonHead.trait.tranformTrait));
        dispatch({ type: LemonHeadActionKind.set_resources, payload: { data: body } });

        const accessories = await Promise.all(dataDefaultSet.items.map(lemonHead.trait.tranformTrait));
        dispatch({ type: LemonHeadActionKind.set_resources, payload: { data: accessories } });
        dispatch({
          type: LemonHeadActionKind.set_default_traits,
          payload: { data: { race: 'human', size: 'medium', gender: 'female' } },
        });

        dispatch({ type: LemonHeadActionKind.set_colorset, payload: { data: dataColorSet?.items } });
      }
    };

    init();
  }, [dataBodySet, dataDefaultSet, dataColorSet]);

  const showPreview = !state.steps[state.currentStep].hidePreview;

  const body = state.traits.find((i) => i?.type === 'body');
  const skinTone = body?.filters?.find((i) => i?.type === FilterType.skin_tone)?.value;

  return (
    <main className="h-dvh w-full flex flex-col divide-y divide-[var(--color-divider)]">
      <div className="bg-background/80 backdrop-blur-md z-10">
        <Header />
      </div>

      <div className="flex-1 h-full overflow-auto no-scrollbar">
        <div className="flex-1 flex flex-col h-full pb-4 md:flex-row-reverse max-w-[1440px] overflow-auto mx-auto gap-5 md:gap-18 p-4 md:p-11 no-scrollbar">
          {showPreview && state.currentStep === LemonHeadStep.getstarted ? (
            <div className="max-w-[80px] md:max-w-[692px] md:max-h-[692px] aspect-square">
              <img
                src={`${ASSET_PREFIX}/assets/images/lemonheads-getstarted.gif`}
                className="rounded-sm w-full h-full"
              />
            </div>
          ) : (
            <div className="flex-1">
              <div className="h-full md:h-auto flex flex-col overflow-hidden gap-8">
                <div className="flex flex-1 md:flex-none items-center justify-center md:max-h-[692px] md:max-w-[692px] md:aspect-square">
                  <LemonHeadPreview traits={state.traits} className="h-full w-fit md:w-full aspect-square" />
                </div>

                <div className="flex gap-3">
                  {skinToneOpts[body?.value || 'human'].map((item) => (
                    <SquareButton
                      key={item.value}
                      active={item.value === skinTone}
                      className="max-w-[44px] aspect-square"
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
                      <div className="w-full h-full rounded-sm" style={{ background: item.color }} />
                    </SquareButton>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className={clsx(showPreview && 'md:flex-1 md:w-[588px]')}>
            {Object.entries(state.steps).map(([key, item]) => {
              if (!item.mounted) return null;
              const Comp = item.component || React.Fragment;
              return <Comp key={key} />;
            })}
          </div>
        </div>
      </div>

      <LemonHeadFooter />
    </main>
  );
}

// <div className="flex-1 overflow-auto md:overflow-hidden">
//   <div className="flex flex-col md:flex-row-reverse max-w-[1440px] mx-auto gap-5 md:gap-18 p-4 md:p-11 md:max-h-full no-scrollbar h-full">
//     {showPreview && (
//       <div className="flex-1">
//         {state.currentStep === LemonHeadStep.getstarted ? (
//           <div className="max-w-[80px] md:max-w-[692px] md:max-h-[692px] aspect-square relative">
//             <img src={`${ASSET_PREFIX}/assets/images/lemonheads-getstarted.gif`} className="rounded-sm w-full h-full" />
//           </div>
//         ) : (
//           <div className="flex-1 overflow-hidden flex flex-col justify-between md:justify-start gap-8">
//             <div className="flex-1 h-full md:max-h-[692px] overflow-hidden flex justify-center items-center">
//               <div className="aspect-square h-full md:h-auto md:w-full">
//                 <LemonHeadPreview traits={state.traits} />
//               </div>
//             </div>
//             <div className="flex gap-3">
//               {skinToneOpts[body?.value || 'human'].map((item) => (
//                 <SquareButton
//                   key={item.value}
//                   active={item.value === skinTone}
//                   className="max-w-[44px] aspect-square"
//                   onClick={() => {
//                     const data = dataBodySet?.items.find(
//                       (i) =>
//                         i.skin_tone === item.value &&
//                         i.size === body?.filters?.find((i) => i.type === 'size')?.value &&
//                         i.gender === body?.filters?.find((i) => i.type === 'gender')?.value &&
//                         i.race === body?.filters?.find((i) => i.type === 'race')?.value,
//                     );
//
//                     if (data) {
//                       dispatch({
//                         type: LemonHeadActionKind.set_skintone,
//                         payload: { data: lemonHead.trait.tranformTrait(data) },
//                       });
//                     }
//                   }}
//                 >
//                   <div className="w-full h-full rounded-sm" style={{ background: item.color }} />
//                 </SquareButton>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )}
//
//     <div className={clsx('md:flex-1', showPreview ? 'max-w-[588px]' : 'h-full')}>
//       {Object.entries(state.steps).map(([key, item]) => {
//         if (!item.mounted) return null;
//         const Comp = item.component || React.Fragment;
//         return <Comp key={key} />;
//       })}
//     </div>
//   </div>
// </div>;
