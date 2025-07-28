import lemonHead from '$lib/trpc/lemonheads';
import { BodyRace, BodySize, Gender, TraitExtends } from '$lib/trpc/lemonheads/types';
import React from 'react';
import { LemonHeadPreview } from '../preview';
import { LemonHeadActionKind, LemonHeadStep, useLemonHeadContext } from '../provider';
import { SquareButton } from '../shared';
import { capitalize } from 'lodash';

const mapping = ['regular', 'skinny', 'toned', 'large'];

export function LemonHeadAboutYou() {
  const [{ resouces, currentStep }, dispatch] = useLemonHeadContext();

  const [state, setState] = React.useState<{ race: BodyRace; size: BodySize; gender: Gender }>({
    race: 'human',
    gender: 'female',
    size: 'regular',
  });

  const getTraitData = (race: BodyRace, size: BodySize, gender: Gender) => {
    const traitSet = lemonHead.trait.getDefaultSet({ race, size, gender })[gender];
    return (Object.entries(traitSet).map(([key, item]) => {
      const trait = lemonHead.trait.getTraitFilter({ type: key, ...item });
      return lemonHead.trait.getTrait({ resouces, data: trait });
    }) || []) as TraitExtends[];
  };

  if (currentStep !== LemonHeadStep.about) return null;

  const handleChange = (data: { race: BodyRace; size: BodySize; gender: Gender }) => {
    setState(data);
    dispatch({ type: LemonHeadActionKind.set_default_traits, payload: { data } });
  };

  return (
    <div className="flex-1 flex flex-col gap-8">
      <div className="hidden md:flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Build Your Base</h3>
        <p className="text-tertiary">Choose your gender, species & body type.</p>
      </div>

      <div className="flex flex-col gap-3">
        <p>Pick your persona</p>
        <div className="grid grid-cols-5 gap-3">
          <div className="grid grid-rows-2 gap-3">
            <SquareButton
              active={state.gender === 'female'}
              onClick={() => handleChange({ ...state, gender: 'female' })}
            >
              <i className="icon-lh-female size-10 text-[#F270A4]" />
            </SquareButton>

            <SquareButton active={state.gender === 'male'} onClick={() => handleChange({ ...state, gender: 'male' })}>
              <i className="icon-lh-male size-10 text-[#70A4FE]" />
            </SquareButton>
          </div>
          <SquareButton
            className="col-span-2"
            active={state.race === 'human'}
            onClick={() => handleChange({ ...state, race: 'human' })}
          >
            <LemonHeadPreview traits={getTraitData('human', 'regular', state.gender)} />
          </SquareButton>
          <SquareButton
            className="col-span-2"
            active={state.race === 'alien'}
            onClick={() => handleChange({ ...state, race: 'alien' })}
          >
            <LemonHeadPreview traits={getTraitData('alien', 'regular', state.gender)} />
          </SquareButton>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p>Choose your body type</p>
        <div className="grid grid-cols-4 gap-3">
          {mapping.map((item) => (
            <SquareButton
              key={item}
              label={capitalize(item)}
              active={state.size === item}
              onClick={() => handleChange({ ...state, size: item as BodySize })}
            >
              <LemonHeadPreview traits={getTraitData(state.race, item as BodySize, state.gender)} />
            </SquareButton>
          ))}
        </div>
      </div>
    </div>
  );
}
