
import { useState } from "react";

import { Button, ModalContent, useModal } from "$lib/components/core";
import { UpdateUserDocument, UserInput } from "$lib/graphql/generated/backend/graphql";
import { useMutation } from "$lib/graphql/request";
import { getFarcasterIdentifier } from "$lib/hooks/useConnectFarcaster";
import { useSignIn } from "$lib/hooks/useSignIn";
import { dummyWalletPassword, handlePasswordRegistration, handleUpdateFlowProfile } from "$lib/services/ory";
import { getOry } from "$lib/utils/ory";
import { ConfirmTransaction } from "./ConfirmTransaction";
import { SuccessModal } from "./SuccessModal";

export const FarcasterAuthPrompt = (props: {
  fid: number;
  profile: UserInput;
  payload: Record<string, unknown>;
  onSuccess: () => Promise<void>;
}) => {
  const modal = useModal();
  const signIn = useSignIn();
  const [updateUser] = useMutation(UpdateUserDocument);

  const [registering, setRegistering] = useState(false);
  const [linking, setLinking] = useState(false);
  const [done, setDone] = useState(false);

  const link = async () => {
    signIn(false, {
      onSuccess: async () => {
        //-- update profile
        try {
          const settingFlow = await getOry().createBrowserSettingsFlow().then((response) => response.data);

          await handleUpdateFlowProfile({
            flow: settingFlow,
            payload: {
              traits: {
                ...settingFlow.identity.traits,
                farcaster_fid: getFarcasterIdentifier(props.fid),
              },
              transient_payload: props.payload,
            },
          });

          modal?.close();
          setDone(true);
          await props.onSuccess();
        }
        finally {
          setLinking(false);
        }
      }
    });
  }

  const register = async () => {
    try {
      setRegistering(true);
      const registrationFlow = await getOry().createBrowserRegistrationFlow().then((response) => response.data);

      await handlePasswordRegistration({
        flow: registrationFlow,
        payload: {
          password: dummyWalletPassword,
          traits: {
            farcaster_fid: getFarcasterIdentifier(props.fid),
          },
          transient_payload: props.payload,
        }
      });

      setDone(true);
      await props.onSuccess();

      await updateUser({
        variables: {
          input: props.profile,
        }
      })
    }
    finally {
      setRegistering(false);
    }
  }

  if (done) return (
    <SuccessModal
      title="Welcome to Lemonade!"
      description='Your account is ready, and your Farcaster wallet is already linked. Start exploring events, communities, and collectibles!'
      buttonText='Start Exploring'
    />
  )

  if (registering) return (
    <ConfirmTransaction
      title="Creating Your Account"
      description="We're setting up your brand-new Lemonade account using your Farcaster Profile. Almost there…"
    />
  )

  if (linking) return (
    <ConfirmTransaction
      title="Linking your account…"
      description="We're securely connecting your Farcaster profile to your existing account. This should only take a moment."
    />
  )

  return (
    <ModalContent>
    <div className='space-y-4'>
      <div className='size-14 flex items-center justify-center rounded-full bg-primary/8'>
        <i className="icon-farcaster text-accent-400 size-8" />
      </div>
      <div className='space-y-1'>
        <p className='text-lg'>Let's Get You Started</p>
        <p className='text-sm text-secondary'>We couldn't find an account connected to this Farcaster profile. Create one now or link an existing account.</p>
      </div>
      <div className='space-y-3'>
        <Button
          onClick={register}
          variant='secondary'
          className='w-full'
        >
          Create New Account
        </Button>
        <p className='text-sm text-secondary text-center'>
          Already have an account? <span className='text-accent-400 cursor-pointer' onClick={link}>Link it here</span>
        </p>
      </div>
    </div>
  </ModalContent>
  );
}
