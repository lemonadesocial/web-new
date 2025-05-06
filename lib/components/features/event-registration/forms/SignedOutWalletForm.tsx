import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import clsx from "clsx";

import { ethereumWalletInputAtom, formInstancesAtom, registrationModal, submitHandlersAtom, useSetAtom } from "../store";
import { Button, LabeledInput, modal } from "$lib/components/core";
import { BlockchainPlatform, ConnectWalletInput } from "$lib/graphql/generated/backend/graphql";
import { formatWallet } from "$lib/utils/crypto";
import { useAppKit, useAppKitAccount } from "$lib/utils/appkit";

import { ConnectWallet } from "../../modals/ConnectWallet";
import { VerifyWalletModal } from "../modals/VerifyWalletModal";

export function SignedOutWalletForm({ required }: { required: boolean }) {
  const form: UseFormReturn<{ connectWalletInput: ConnectWalletInput | null }> = useForm<{ connectWalletInput: ConnectWalletInput | null }>({
    defaultValues: {
      connectWalletInput: null,
    },
  });
  const setFormInstances = useSetAtom(formInstancesAtom);
  const setSubmitHandlers = useSetAtom(submitHandlersAtom);
  const setEthereumWalletInput = useSetAtom(ethereumWalletInputAtom);

  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  const onSubmit = (values: { connectWalletInput: ConnectWalletInput }) => {
    setEthereumWalletInput(values.connectWalletInput);
  };

  const onVerify = () => {
    form.clearErrors('connectWalletInput');

    modal.open(ConnectWallet, {
      props: {
        onConnect: verifyWallet,
      },
      dismissible: true
    });
  };

  const verifyWallet = () => {
    modal.close();

    registrationModal.open(VerifyWalletModal, {
      props: {
        onSuccess: (signature: string, token: string) => {
          form.setValue('connectWalletInput', {
            signature,
            token,
            platform: BlockchainPlatform.Ethereum,
          });

          registrationModal.close();
        },
      },
    });
  };

  useEffect(() => {
    setFormInstances(prev => ({ ...prev, ethereumWallet: form }));
    setSubmitHandlers(prev => ({ ...prev, ethereumWallet: onSubmit }));
  }, []);

  useEffect(() => {
    form.register('connectWalletInput', {
      required,
    });
  }, [required]);

  return (
    <>
      <LabeledInput label="Your Ethereum Address" required>
        {
          form.watch('connectWalletInput') ? (
            <div className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-sm bg-primary/8">
              <i className="icon-eth text-tertiary size-5" />
              <p className="flex-1">
                {formatWallet(address!)}
              </p>
              <i
                className="icon-edit-sharp cursor-pointer text-tertiary size-5"
                onClick={() => open()}
              />
            </div>
          ) : (
            <Button
              variant="tertiary"
              className={clsx(
                'w-fit',
                form.formState.errors.connectWalletInput && 'bg-danger-400/16 hover:bg-danger-400/20 text-danger-400',
              )}
              iconLeft="icon-eth"
              onClick={onVerify}
            >
              Verify with Wallet
            </Button>
          )}
      </LabeledInput>
    </>
  );
};
