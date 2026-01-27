'use client';
import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ethers } from 'ethers';
import { useAppKitAccount } from '@reown/appkit/react';
import { Avatar, Button, Card, modal, ModalContent, toast } from '$lib/components/core';

import { truncateMiddle } from '$lib/utils/string';
import { userAvatar } from '$lib/utils/user';
import { Controller, useForm } from 'react-hook-form';
import { ConfirmModal } from '$lib/components/features/modals/ConfirmModal';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  GetListMyLemonheadInvitationsDocument,
  SetUserWalletDocument,
  UpdateMyLemonheadInvitationsDocument,
  User,
} from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { VerifyWalletModal } from '$lib/components/features/event-registration/modals/VerifyWalletModal';

export function InviteFriend({ locked }: { locked?: boolean }) {
  const me = useMe();
  const signIn = useSignIn();
  const { address } = useAppKitAccount();

  const { data } = useQuery(GetListMyLemonheadInvitationsDocument, { skip: !me });
  const invitations = data?.listMyLemonheadInvitations.invitations || [];

  const [setUserWallet] = useMutation(SetUserWalletDocument, {
    onComplete: (_, res) => {
      if (res.setUserWallet) {
        modal.close();
        setTimeout(() => modal.open(InviteFriendModal), 500);
      } else {
        toast.error('Verify wallet fail!');
      }
    },
  });

  const handleInvite = () => {
    if (!me) signIn();
    else {
      if (me.wallets_new?.ethereum?.includes(address)) modal.open(InviteFriendModal);
      else {
        modal.open(VerifyWalletModal, {
          props: { onSuccess: (signature, token) => setUserWallet({ variables: { signature, token } }) },
        });
      }
    }
  };

  return (
    <>
      <div
        className="flex w-full min-w-fit items-center md:hidden p-2.5 border-(length:--card-border-width) border-card-border rounded-md justify-between gap-4"
        onClick={() => {
          if (invitations.length === 5) {
            handleInvite();
          }
        }}
      >
        <div className="flex gap-2.5 flex-1 items-center">
          <div className="flex justify-center items-center rounded-sm bg-alert-400/16 size-8 p-1.5 aspect-square">
            <i className="icon-user-plus text-alert-400" />
          </div>

          <div className="flex flex-col gpa-1.5">
            <p>Invite</p>
            <p className="text-secondary text-sm">
              {!locked ? `You have ${invitations.length}/5 invites left.` : 'Claim your LemonHead to unlock.'}
            </p>
          </div>
        </div>

        {!locked && (
          <Button variant="secondary" onClick={handleInvite} size="sm">
            Invite
          </Button>
        )}
      </div>

      <div
        className="hidden md:flex p-4 border-(length:--card-border-width) border-card-border  rounded-md flex-col gap-3"
        onClick={() => {
          if (invitations.length === 5) {
            handleInvite();
          }
        }}
      >
        <div className="flex justify-between">
          <div className="flex justify-center items-center rounded-full bg-alert-400/16 size-[48px] aspect-square">
            <i className="icon-user-plus text-alert-400" />
          </div>

          <div className="tooltip tooltip-bottom">
            <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
              <p>LemonHeads are currently invite-only. Each LemonHead can invite up to 5 wallets to mint their own.</p>
            </div>
            <i className="icon-info size-5 aspect-square text-quaternary" />
          </div>
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Invite a Friend</p>
          <p className="text-secondary text-sm">
            {!locked ? `You have ${invitations.length}/5 invites left.` : 'Claim your LemonHead to unlock.'}
          </p>
        </div>

        {!locked && <InviteProgress invited={invitations.length} />}

        {!locked && invitations.length < 5 && (
          <Button variant="secondary" onClick={handleInvite}>
            Invite
          </Button>
        )}
      </div>
    </>
  );
}

function InviteProgress({ invited = 0 }: { invited?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div
          key={idx}
          className={clsx(
            'h-2 flex-1 first:rounded-l-full last:rounded-r-full',
            idx < invited ? 'bg-alert-400' : 'bg-quaternary',
          )}
        />
      ))}
    </div>
  );
}

export function InviteFriendModal() {
  const { data, refetch } = useQuery(GetListMyLemonheadInvitationsDocument);
  const invitations = data?.listMyLemonheadInvitations.invitations || [];
  const [step, setStep] = React.useState<'default' | 'invite_form'>('default');

  const { control, setValue, watch, reset, handleSubmit } = useForm({
    defaultValues: {
      addresses: Array.from({ length: 5 - invitations.length }).map(() => ''),
    },
  });
  const addresses = watch('addresses');

  const [update, { loading }] = useMutation(UpdateMyLemonheadInvitationsDocument, {
    onError: (error) => {
      toast.error(error.message);
    },
    onComplete: async (_client, res) => {
      if (!res.updateMyLemonheadInvitations.success && res.updateMyLemonheadInvitations.message) {
        toast.error(res.updateMyLemonheadInvitations.message);
        return;
      }

      if (res.updateMyLemonheadInvitations.success) {
        await refetch();

        if (step === 'default') toast.success('Removed success!');
        else if (step === 'invite_form') {
          const count = addresses.filter(Boolean).length;
          toast.success(`Success! ${count} ${count > 1 ? 'wallets' : 'wallet'} have been added to the invite list.`);
          setStep('default');
        }
      }
    },
  });

  React.useEffect(() => {
    if (data?.listMyLemonheadInvitations.invitations) {
      reset({
        addresses: Array.from({ length: 5 - data?.listMyLemonheadInvitations.invitations.length }).map(() => ''),
      });
    }
  }, [data?.listMyLemonheadInvitations.invitations.length]);

  const onConfirm = (values: { addresses: string[] }) => {
    const wallets = values.addresses.filter(Boolean);
    update({ variables: { invitations: [...invitations.map((i) => i.invitee_wallet as string), ...wallets] } });
  };

  const renderContent = () => {
    if (step === 'invite_form') {
      return (
        <>
          <p className="text-secondary text-sm">
            Enter the wallet IDs of the friends you want to invite. Each will get access to mint their own LemonHead.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onConfirm)}>
            <div className="border rounded-sm overflow-hidden">
              <Controller
                name="addresses"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      {field.value.map((address, idx) => (
                        <div key={idx} className="flex bg-(--input-bg) not-first:border-t border-(--color-divider)">
                          <input
                            className={clsx(
                              'px-3.5 py-2 flex-1 outline-none',
                              address && !ethers.isAddress(address) && 'text-danger-500',
                            )}
                            value={address}
                            placeholder="Enter ENS or wallet address"
                            onChange={(e) => {
                              field.value[idx] = e.target.value;
                              setValue('addresses', field.value);
                            }}
                          />
                          <div
                            className="flex items-center justify-center cursor-pointer text-quaternary hover:text-primary p-2.5 border-l"
                            onClick={() => {
                              field.value[idx] = '';
                              setValue('addresses', field.value);
                            }}
                          >
                            <i className="icon-x size-5" />
                          </div>
                        </div>
                      ))}
                    </>
                  );
                }}
              />
            </div>

            <Button
              variant="secondary"
              type="submit"
              loading={loading}
              disabled={!addresses.some((i) => i != '' && ethers.isAddress(i))}
              className="w-full"
            >
              Confirm
            </Button>
          </form>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-col gap-2">
          <p className="text-lg">LemonHeads Invites</p>
          <p className="text-secondary text-sm">
            LemonHeads are currently invite-only. You have unlocked 5 invites with your mint!
          </p>
        </div>

        <InviteProgress invited={data?.listMyLemonheadInvitations.invitations.length} />

        <div className="flex flex-col gap-2">
          {data?.listMyLemonheadInvitations.invitations.map((item, idx) => {
            return (
              <Card.Root key={idx}>
                <Card.Content className="flex items-center gap-3 px-3 py-1.5">
                  <Avatar src={userAvatar(item.user as unknown as User)} size="lg" />
                  <div className="flex-1">
                    <div className="flex gap-2">
                      {item.user?.username && <p>{item.user.username}</p>}
                      <p className="text-tertiary">{truncateMiddle(item.invitee_wallet!, 6, 4)}</p>
                    </div>
                    <p className="capitalize text-tertiary text-sm">{item.minted_at ? 'minted' : 'pending'}</p>
                  </div>
                  {!item.minted_at && (
                    <i
                      className="icon-person-remove text-quaternary size-5 cursor-pointer hover:text-primary"
                      onClick={() =>
                        modal.open(ConfirmModal, {
                          props: {
                            icon: 'icon-person-remove',
                            title: 'Remove Wallet?',
                            subtitle:
                              'Are you sure you want to remove this wallet from your invite list? They’ll lose the ability to mint a LemonHead.',
                            onConfirm: async () => {
                              await update({
                                variables: {
                                  invitations: invitations
                                    .filter((i) => i.invitee_wallet !== item.invitee_wallet)
                                    .map((i) => i.invitee_wallet as string),
                                },
                              });
                            },
                          },
                        })
                      }
                    />
                  )}
                </Card.Content>
              </Card.Root>
            );
          })}
        </div>

        <Button
          variant="secondary"
          disabled={data?.listMyLemonheadInvitations.invitations.length === 5}
          onClick={() => setStep('invite_form')}
        >
          Invite a Friend
        </Button>
      </>
    );
  };

  return (
    <ModalContent
      icon={step === 'default' ? 'icon-user-plus' : ''}
      title={step === 'invite_form' ? 'Invite a Friend' : ''}
      onBack={step === 'invite_form' ? () => setStep('default') : undefined}
      onClose={() => modal.close()}
      className="w-full max-w-[448px] h-auto transition-all ease-in-out"
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          layout
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </ModalContent>
  );
}
