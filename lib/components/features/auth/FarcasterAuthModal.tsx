import { useEffect, useState } from "react";
import { isMobile } from 'react-device-detect';

import { SignInData } from "$lib/hooks/useConnectFarcaster";
import { useSignIn as useFarcasterSignIn, QRCode, AuthKitProvider } from "@farcaster/auth-kit";
import { modal, ModalContent } from "$lib/components/core";

const FarcasterAuthInner = (props: { nonce: string, onSuccess: (data: SignInData) => void }) => {
  const [connected, setConnected] = useState(false);

  const { signIn, connect, url } = useFarcasterSignIn({
    nonce: props.nonce,
    onStatusResponse: async (args: { state: 'completed' | 'pending' }) => {
      if (args.state === 'completed') {
        await props.onSuccess(args as unknown as SignInData);
      }
    },
  });

  useEffect(() => {
    connect().then(() => setConnected(true));
  }, []);

  useEffect(() => {
    if (connected && url) {
      signIn();
    }
  }, [connected, url]);

  useEffect(() => {
    if (isMobile && url) {
      window.open(url, '_blank');
    }
  }, [isMobile, url]);

  if (!url) {
    return (
      <ModalContent>
        <div className='space-y-4'>
          <div className='size-14 flex items-center justify-center rounded-full bg-background/64 relative'>
            <div className='absolute -inset-1 rounded-full border-2 border-transparent'>
              <div className='w-full h-full rounded-full border-2 border-tertiary border-t-transparent border-r-transparent animate-spin'></div>
            </div>
            <i className="icon-farcaster text-accent-400 size-8" />
          </div>
          <div className='space-y-1'>
            <p className='text-lg'>Connecting to Farcaster</p>
            <p className='text-sm text-secondary'>We're securely connecting to Farcaster and preparing your QR code for authentication. This should only take a moment.</p>
          </div>
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent
      title="Scan to Sign In"
      onBack={() => modal.close()}
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-secondary">Open the Farcaster app on your phone and scan the QR code below to sign in.</p>
        <div className="p-4 rounded-sm bg-primary/8">
          <div className="bg-white flex items-center justify-center">
            <QRCode uri={url} size={310} />
          </div>
        </div>
        <p className="text-sm text-secondary">Already on your phone? <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent-400 cursor-pointer">Open Farcaster</a></p>
      </div>
    </ModalContent>
  )
}

export const FarcasterAuthModal = (props: { nonce: string, onSuccess: (data: SignInData) => void }) => {
  return <AuthKitProvider config={{}}>
    <FarcasterAuthInner {...props} />
  </AuthKitProvider>
}
