'use client';
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

  const { status, createNewAccount, handleLinkWithAccount } = useHandleUnicornCookie(cookie, onSuccess);

  const linkOtherAccount = async () => {
    if (session) {
      await logOut();
    }

    signIn(false, {
      onSuccess: () => {
        //-- close current login modal
        modal.close();

        handleLinkWithAccount();
      }
    });
  };

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
          <p className='text-lg'>Authenticating With Unicorn</p>
          <p className='text-sm text-secondary'>We're securely verifying your Unicorn account details and preparing to connect them to Lemonade. This should only take a moment.</p>
        </div>
      </div>
    </ModalContent>
  );

  if (status === 'linked') return (
    <SuccessModal
      title="Welcome to Lemonade!"
      description='Your account is ready, and your Unicorn wallet is already linked. Start exploring events, communities, and collectibles!'
      buttonText='Start Exploring'
    />
  );

  if (status === 'processed') return (
    <SuccessModal
      title="You're All Set!"
      description='We found your Lemonade account with the same email as your Unicorn account. Your wallet is now linked and ready to use.'
      buttonText='Continue to Lemonade'
    />
  );

  if (status === 'link-options') return (
    <ModalContent>
      <div className='space-y-4'>
        <div className='size-14 flex items-center justify-center rounded-full bg-primary/8'>
          <img src={`${ASSET_PREFIX}/assets/images/wallet-unicorn.png`} alt='Unicorn Logo' className='w-[26px] relative z-10' />
        </div>
        <div className='space-y-1'>
          <p className='text-lg'>Let's Get You Started</p>
          <p className='text-sm text-secondary'>We couldn't find a Lemonade account for your Unicorn email. Create one now or link an existing account.</p>
        </div>
        <div className='space-y-3'>
          <Button
            onClick={createNewAccount}
            variant='secondary'
            className='w-full'
          >
            Create New Account
          </Button>
          <p className='text-sm text-secondary text-center'>
            Already have an account? <span className='text-accent-400 cursor-pointer' onClick={linkOtherAccount}>Link it here</span>
          </p>
        </div>
      </div>
    </ModalContent>
  );

  if (status === 'creating') return (
    <ConfirmTransaction
      title='Creating Your Account'
      description="We're setting up your brand-new Lemonade account using your Unicorn email and wallet. Almost there…"
    />
  );

  return null;
}
