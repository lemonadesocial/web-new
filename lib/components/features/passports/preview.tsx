'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { skipToken } from '@tanstack/react-query';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { trpc } from '$lib/trpc/client';

import { usePassportContext } from './provider';
import { PassportActionKind, PassportStep } from './types';
import { useAppKitAccount } from '@reown/appkit/react';

export function PassportPreview() {
  return (
    <>
      <ImagePreview className="md:hidden" />

      <div className="hidden md:block flex-1 h-full pt-6 pb-12">
        <div
          className="h-full flex items-center rounded-md p-12 bg-primary/8"
          style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/preview-bg.png)` }}
        >
          <ImagePreview />
        </div>
      </div>
    </>
  );
}

function ImagePreview({ className }: { className?: string }) {
  const [state, dispatch] = usePassportContext();
  const { address } = useAppKitAccount();
  console.log(state);

  const variables = !address
    ? skipToken
    : {
        avatarImageUrl: state.photo,
        username: state.lemonadeUsername || state.ensName,
        provider: state.provider,
        wallet: address,
        fluffleTokenId: state.useFluffle ? '1' : undefined,
      };

  const getImage = trpc.passport.getImage.useQuery(variables);
  const loading = getImage.isPending;

  React.useEffect(() => {
    if (getImage.data) {
      dispatch({ type: PassportActionKind.SetMintData, payload: getImage.data });
      dispatch({ type: PassportActionKind.SetPassportImage, payload: getImage.data.image });
    }
  }, [getImage?.data]);

  if (loading && !state.passportImage) {
    return (
      <div className={twMerge('relative', className)}>
        <img
          src={`${ASSET_PREFIX}/assets/images/passports/${state.provider}-passport-mini.png`}
          className="w-full object-cover"
        />
      </div>
    );
  }

  if (state.passportImage) {
    return <img src={state.passportImage} className={twMerge('w-full object-cover', className)} />;
  }

  // return (
  //   <div className={twMerge('relative', className)}>
  //     <img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="w-full object-cover" />
  //     {state.photo && <img src={state.photo} className="absolute top-[27%] w-[28.5%] left-[8%] rounded-[5%]" />}
  //   </div>
  // );
}
