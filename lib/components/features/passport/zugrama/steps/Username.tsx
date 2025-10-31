import React, { useEffect, useState } from 'react';

import { useAppKitAccount } from '$lib/utils/appkit';
import { ethers } from 'ethers';
import { mainnet } from 'viem/chains';
import { Button, Card, Skeleton, toast } from '$lib/components/core';
import { formatError } from '$lib/utils/crypto';
import { PassportActionKind, usePassportContext } from '../provider';

export function PassportUsername() {
  // const { address } = useAppKitAccount();
  const address = '0xb41e34e0b3272e88ef9852f4557e98961fdedf19'

  const [state, dispatch] = usePassportContext();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchENSName = async () => {
      setIsLoading(true);
      try {
        const provider = new ethers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]);
        const name = await provider.lookupAddress(address);
        dispatch({ type: PassportActionKind.SetEnsName, payload: `@${name}` });
      } catch (error) {
        toast.error(formatError(error))
      } finally {
        setIsLoading(false);
      }
    };

    fetchENSName();
  }, [address]);

  return (
    <div className="flex-1 flex flex-col gap-6 md:py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-5xl font-semibold leading-tight">Select passport name.</h1>
        <p className="text-tertiary">Verify yourself and pick an ENS name or claim one.</p>
      </div>

      {isLoading ? (
        <div className="px-3 py-4 rounded-md flex items-center gap-4 bg-card w-full">
          <div className="flex items-center justify-center p-2 rounded-sm bg-primary/8 aspect-square">
            <i className="icon-ens size-[22px]" />
          </div>
          <div className="space-y-0.5 flex-1">
            <Skeleton animate className="h-5 w-[160px] rounded-full" />
            <Skeleton className="h-4 w-[100px] rounded-full mt-1" />
          </div>
        </div>
      ) : !state.ensName ? (
        <div className="flex flex-col gap-5 pt-12 pb-6 items-center rounded-md border border-divider border-dashed">
          <i className="icon-ens size-[128px] text-tertiary" />
          <div>
            <h2 className="text-xl font-semibold text-tertiary text-center">No ENS Name Found</h2>
            <p className="text-tertiary text-center">Get your ENS domain to use as your passport name.</p>
          </div> 
          <Button
            variant="secondary"
            iconRight="icon-arrow-outward"
            onClick={() => window.open('https://ens.domains/', '_blank')}
          >
            Get ENS
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-start">
          <div className="px-3 py-4 border border-primary rounded-md flex items-center gap-4 bg-card w-full">
            <div className="flex items-center justify-center p-2 rounded-sm bg-primary/8 aspect-square">
              <i className="icon-ens size-[22px]" />
            </div>
            <div className="space-y-0.5 flex-1">
              <p>@{state.ensName}</p>
              <p className="text-sm text-tertiary">ENS Domain</p>
            </div>
            <i className="icon-check-filled" />
          </div>
          <Button
            variant="tertiary"
            iconRight="icon-arrow-outward"
            onClick={() => window.open('https://ens.domains/', '_blank')}
          >
            Get Another ENS
          </Button>
        </div>
      )}
    </div>
  );
}
