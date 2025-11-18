'use client';
import { useEffect, useState } from "react";

import { useHandleUnicornCookie } from './unicorn';
import { useRawLogout } from '$lib/hooks/useLogout';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';
import { Button, modal, ModalContent } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { SuccessModal } from '../modals/SuccessModal';
import { ConfirmTransaction } from '../modals/ConfirmTransaction';

interface Props {
  cookie: string;
  onSuccess: (reload?: boolean, keepModalOpen?: boolean) => void;
}

export function UnicornAuth({ cookie, onSuccess }: Props) {
  const logOut = useRawLogout();
  const session = useSession();
  const signIn = useSignIn();
  const { siwe, status, createNewAccount, handleLinkWithAccount } = useHandleUnicornCookie(cookie, onSuccess);

  const [readyToLink, setReadyToLink] = useState(false);

  const linkOtherAccount = async () => {
    if (session) {
      await logOut();
    }

    signIn(false, {
      onSuccess: () => {
        //-- close current login modal
        modal.close();

        setReadyToLink(true);
      }
    });
  };

  useEffect(() => {
    if (siwe && readyToLink) {
      handleLinkWithAccount(siwe);
    }
  }, [siwe, readyToLink]);

  if (status === 'processing') return (
    <ModalContent>
      <div className='space-y-4'>
        <div className='size-14 flex items-center justify-center rounded-full bg-background/64 relative'>
          <div className='absolute -inset-1 rounded-full border-2 border-transparent'>
            <div className='w-full h-full rounded-full border-2 border-tertiary border-t-transparent border-r-transparent animate-spin'></div>
          </div>
          <img src={`${ASSET_PREFIX}/assets/images/wallet-unicorn.png`} alt='Unicorn Logo' className='w-[26px] relative z-10' />
        </div>
        <div className='space-y-1'>
          <p className='text-lg'>Authenticating With ETHDenver</p>
          <p className='text-sm text-secondary'>We're verifying your ETHDenver Account details and preparing to connect them to Lemonade.</p>
        </div>
      </div>
    </ModalContent>
  );

  if (status === 'linked') return (
    <SuccessModal
      title="Welcome to Lemonade!"
      description={`You're all set to claim your ETH Denver ticket!`}
      buttonText='Claim Ticket'
    />
  );

  if (status === 'processed') return (
    <SuccessModal
      title="You're All Set!"
      description='We found your Lemonade account with the same email as your ETHDenver account. Your wallet is now linked and ready to use.'
      buttonText='Continue to Lemonade'
    />
  );

  if (status === 'link-options') return (
    <ModalContent>
      <div className='space-y-4'>
        <div className='size-14 flex items-center justify-center rounded-full bg-primary/8'>
          <img src={`${ASSET_PREFIX}/assets/images/wallet-unicorn.png`} alt='Unicorn Logo' className='w-[26px] relative z-10' />
        </div>
        <p className='text-lg'>Let's Get You Started</p>
        <div className='space-y-3'>
          <Button
            disabled={!siwe}
            onClick={() => siwe && createNewAccount(siwe)}
            variant='secondary'
            className='w-full'
          >
            New to Lemonade
          </Button>
          <p className='text-sm text-center text-accent-400 cursor-pointer' onClick={linkOtherAccount}>Continue with existing Lemonade Account</p>
        </div>
      </div>
    </ModalContent>
  );

  if (status === 'creating') return (
    <ConfirmTransaction
      title='Creating Your Account'
      description="We're setting up your brand-new Lemonade account associated with your ETHDenver account and wallet. Almost there…"
    />
  );

  return null;
}
