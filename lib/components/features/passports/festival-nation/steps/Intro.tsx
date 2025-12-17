import React from 'react';

export function PassportIntro() {
  return (
    <div className="flex-1 h-full flex flex-col md:justify-center gap-4 md:gap-8 md:py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-7xl font-semibold leading-tight">Join The Vinyl Nation</h1>

        <p className="text-tertiary">
          Mint your Festival Passport and join a community built by music lovers, collectors, and creators.
        </p>
      </div>
    </div>
  );
}
