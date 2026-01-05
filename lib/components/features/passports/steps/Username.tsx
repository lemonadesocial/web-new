import React from 'react';

import { UsernameCard, ENSDomainCard } from './UsernameCards';
import { usePassportContext } from '../provider';

export function PassportUsername() {
  const [state] = usePassportContext();

  return (
    <div className="flex-1 flex flex-col gap-6 md:py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold leading-tight">{state.ui?.[state.currentStep!]?.title}</h1>
        <p className="text-tertiary">{state.ui?.[state.currentStep!]?.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3">
        {state.enabled?.lemonadeUsername && <UsernameCard />}
        {state.enabled?.ens && <ENSDomainCard />}
      </div>
    </div>
  );
}
