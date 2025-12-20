import React from 'react';

import { UsernameCard, ENSDomainCard } from './UsernameCards';

export function PassportUsername() {
  return (
    <div className="flex-1 flex flex-col gap-6 md:py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold leading-tight">Select passport name.</h1>
        <p className="text-tertiary">Choose what appears on your passport, your username or ENS.</p>
      </div>

      <div className="flex flex-col gap-3">
        <UsernameCard />
        <ENSDomainCard />
      </div>
    </div>
  );
}
