import React from 'react';
import clsx from 'clsx';

import { Button, Skeleton } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { useFluffle } from '$lib/hooks/useFluffle';
import { PassportActionKind, usePassportContext } from '../provider';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function LemonheadCard() {
  const { data, loading } = useLemonhead();
  const [state, dispatch] = usePassportContext();

  const handleSelect = () => {
    dispatch({ type: PassportActionKind.SelectLemonhead });
  };

  const isSelected = state.useLemonhead;
  return (
    <div
      className={`flex flex-col gap-4 rounded-md bg-card p-4 transition-all border ${isSelected ? 'border-primary' : 'border-card-border'}`}
    >
      {loading || !data ? (
        <>
          <Skeleton animate className="w-full h-64 rounded-sm" />
          <div className="flex flex-col gap-4">
            <Skeleton animate className="h-4 w-24 rounded-full" />
            <Skeleton animate className="h-3 w-32 rounded-full" />
          </div>
        </>
      ) : (
        <>
          <img src={data.image} className={clsx('w-full aspect-square border-card-border rounded-sm')} />
          <div className="flex flex-col gap-1">
            <p>LemonHead #{data.tokenId}</p>
            <p className="hidden md:block text-sm text-tertiary">Set LemonHead as Passport Photo.</p>
          </div>
          <Button
            variant={isSelected ? 'tertiary' : 'secondary'}
            className="w-full"
            onClick={handleSelect}
            iconLeft={isSelected ? 'icon-done' : undefined}
            size="sm"
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </>
      )}
    </div>
  );
}

export function FluffleCard() {
  const { data, loading } = useFluffle();
  const [state, dispatch] = usePassportContext();

  const handleSelect = () => {
    dispatch({ type: PassportActionKind.SelectFluffle });
  };

  const isSelected = state.useFluffle;

  if (loading) {
    return (
      <div className="flex flex-col gap-4 rounded-md bg-card p-4 transition-all border border-card-border">
        <Skeleton animate className="w-full h-64 rounded-sm" />
        <div className="flex flex-col gap-4">
          <Skeleton animate className="h-4 w-24 rounded-full" />
          <Skeleton animate className="h-3 w-32 rounded-full" />
        </div>
      </div>
    );
  }

  if (data?.hasToken) {
    return (
      <div
        className={`flex flex-col gap-4 rounded-md bg-card p-4 transition-all border ${isSelected ? 'border-primary' : 'border-card-border'}`}
      >
        <img src={data.image} className="w-full h-64 object-cover border-card-border rounded-sm" />
        <div className="flex flex-col gap-1">
          <p>Fluffle #{data.tokenId}</p>
          <p className="hidden md:block text-sm text-tertiary">Set Fluffle as Passport Photo.</p>
        </div>
        <Button
          variant={isSelected ? 'tertiary' : 'secondary'}
          className="w-full"
          onClick={handleSelect}
          iconLeft={isSelected ? 'icon-done' : undefined}
          size="sm"
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-card p-4 transition-all border-2 border-dashed border-card-border">
      <img src={`${ASSET_PREFIX}/assets/images/fluffle.png`} className="w-full aspect-square" />
      <div className="flex flex-col gap-1">
        <p>Get Fluffle</p>
        <p className="hidden md:block text-sm text-tertiary">You don’t have a fluffle, yet.</p>
      </div>
      <Button
        variant={isSelected ? 'tertiary' : 'secondary'}
        className="w-full"
        onClick={handleSelect}
        iconLeft={isSelected ? 'icon-done' : undefined}
        size="sm"
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </div>
  );
}
