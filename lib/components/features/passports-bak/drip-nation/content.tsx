'use client';
import { PASSPORT_CONFIG } from '../config';
import { PassportStep, usePassportContext } from './provider';
import { PassportPreview } from './preview';

export function DripNationPassportContent() {
  const [state] = usePassportContext();
  const provider = state.provider;
  const Comp = PASSPORT_CONFIG[provider].steps[state.currentStep].component;

  return (
    <>
      <Comp />
      {state.currentStep !== PassportStep.celebrate && <PassportPreview />}
    </>
  );
}
