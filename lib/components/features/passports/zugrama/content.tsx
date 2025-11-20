'use client';
import { PASSPORT_CONFIG } from '../config';
import { PassportStep, usePassportContext } from './provider';
import { PassportPreview } from './preview';

export function ZugramaPassportContent() {
  const [state] = usePassportContext();
  const Comp = PASSPORT_CONFIG.zugrama.steps[state.currentStep].component;

  return (
    <>
      <Comp />
      {state.currentStep !== PassportStep.celebrate && <PassportPreview />}
    </>
  );
}
