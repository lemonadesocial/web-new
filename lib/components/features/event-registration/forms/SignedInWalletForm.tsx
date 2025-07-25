import { useForm, UseFormReturn } from "react-hook-form";
import { useEffect } from "react";
import clsx from "clsx";

import { formInstancesAtom, registrationModal, useSetAtom } from "../store";
import { Button, LabeledInput, Menu, MenuItem, modal, toast } from "$lib/components/core";
import { SetUserWalletDocument } from "$lib/graphql/generated/backend/graphql";
import { formatWallet } from "$lib/utils/crypto";
import { useAppKit, appKit } from "$lib/utils/appkit";
import { useMe } from "$lib/hooks/useMe";
import { useMutation } from "$lib/graphql/request";
import { defaultClient } from "$lib/graphql/request/instances";

import { ConnectWallet } from "../../modals/ConnectWallet";
import { VerifyWalletModal } from "../modals/VerifyWalletModal";

export function SignedInWalletForm({ required }: { required: boolean }) {
  const me = useMe();

  const userWallets = me?.wallets_new?.ethereum?.filter((wallet: string) => wallet !== me?.wallet_custodial) || [];

  const form: UseFormReturn<{ selectedAddress: string }> = useForm<{ selectedAddress: string }>({
    defaultValues: {
      selectedAddress: userWallets[0] || '',
    },
  });
  const setFormInstances = useSetAtom(formInstancesAtom);

  const { open } = useAppKit();

  const [setUserWallet, { loading }] = useMutation(SetUserWalletDocument);

  const onVerify = () => {
    form.clearErrors('selectedAddress');

    modal.open(ConnectWallet, {
      props: {
        onConnect: verifyWallet,
      },
    });
  };

  const verifyWallet = () => {
    modal.close();

    registrationModal.open(VerifyWalletModal, {
      props: {
        onSuccess: async (signature: string, token: string) => {
          try {
            await setUserWallet({
              variables: {
                signature,
                token
              }
            });

            const currentAddress = appKit.getAddress()!;
            
            defaultClient.writeFragment({
              id: `User:${me?._id}`,
              data: {
                wallets_new: {
                  ethereum: [...(me?.wallets_new?.ethereum ?? []), currentAddress]
                }
              }
            });
            form.setValue('selectedAddress', currentAddress);
          } catch (error: any) {
            toast.error(error.message);
          } finally {
            registrationModal.close();
          }
        },
      },
      dismissible: false
    });
  };

  useEffect(() => {
    setFormInstances(prev => ({ ...prev, ethereumWallet: form }));
  }, []);

  useEffect(() => {
    form.register('selectedAddress', {
      required,
    });
  }, [required]);

  useEffect(() => {
    if (userWallets.length && !form.getValues('selectedAddress')) {
      form.setValue('selectedAddress', userWallets[0]);
    }
  }, [userWallets, form]);

  const selectedAddress = form.watch('selectedAddress');

  return (
    <>
      <LabeledInput label="Your Ethereum Address" required={required}>
        {
          userWallets.length && selectedAddress ? (
            <Menu.Root>
              <Menu.Trigger>
                {({ toggle }) => (
                  <div className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-sm bg-primary/8 cursor-pointer" onClick={toggle}>
                    <i className="icon-eth text-tertiary size-5" />
                    <p className="flex-1">
                      {formatWallet(selectedAddress)}
                    </p>
                    <i
                      className="icon-arrow-down cursor-pointer text-tertiary size-5"
                      onClick={() => open()}
                    />
                  </div>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-0 min-w-[372px]">
                {({ toggle }) => (
                  <>
                    <div className="p-1">
                      <p className="text-tertiary text-sm py-1 px-2">Saved Wallets</p>
                      {userWallets.map((wallet: string) => (
                        <MenuItem
                          key={wallet}
                          onClick={() => {
                            form.setValue('selectedAddress', wallet);
                            toggle();
                          }}
                          title={formatWallet(wallet)}
                        />
                      ))}
                    </div>
                    <hr className="border-card-border" />
                    <div className="p-1">
                      <MenuItem
                        onClick={() => {
                          onVerify();
                          toggle();
                        }}
                        iconLeft={<i className="icon-wallet size-5 text-tertiary" />}
                        title="New Wallet"
                      />
                    </div>
                  </>
                )}
              </Menu.Content>
            </Menu.Root>
          ) : (
            <Button
              variant="tertiary"
              className={clsx(
                'w-fit',
                form.formState.errors.selectedAddress && 'bg-danger-400/16 hover:bg-danger-400/20 text-danger-400',
              )}
              iconLeft="icon-eth"
              onClick={onVerify}
              loading={loading}
            >
              Verify with Wallet
            </Button>
          )}
      </LabeledInput>
    </>
  );
}
