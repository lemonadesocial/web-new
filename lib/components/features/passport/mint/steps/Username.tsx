import React from 'react';

import { UsernameCard, ENSDomainCard } from './UsernameCards';

export function PassportUsername() {
  return (
    <div className="flex-1 flex flex-col gap-6 justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold leading-tight">Your name, your identity.</h1>
        <p className="text-tertiary">Pick a unique username to represent you across the United Stands of Lemonade.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <UsernameCard />
        <ENSDomainCard />
      </div>
    </div>
  );
}
