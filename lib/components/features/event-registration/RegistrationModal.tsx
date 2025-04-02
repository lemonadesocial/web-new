import { Avatar, Button } from "$lib/components/core";
import { useMe } from "$lib/hooks/useMe";
import { userAvatar } from "$lib/utils/user";

import { BuyerInfoForm } from "./forms/BuyerInfoForm";
import { registrationModal, useAtomValue } from "./store";
import { SubmitForm } from "./SubmitForm";
import { pricingInfoAtom } from "./store";
import { useRedeemTickets } from "./hooks";

export function RegistrationModal() {
  const me = useMe();
  const pricing = useAtomValue(pricingInfoAtom);

  const { redeemTickets, loadingRedeem } = useRedeemTickets();

  const isFree = pricing?.total === '0';

  return (
    <div className='h-screen w-screen bg-background/80 [backdrop-filter:var(--backdrop-filter)] flex pt-24 justify-center gap-12'>
      <div className="absolute top-4 right-4">
        <Button
          variant="tertiary-alt"
          icon="icon-x"
          className="rounded-full"
          onClick={() => registrationModal.close()}
        >
          Close
        </Button>
      </div>
      <div className='flex flex-col gap-8 w-[372]'>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-4'>
            <h3 className='font-semibold text-[24px]'>Your Info</h3>
            {
              me && (
                <div className='flex gap-3'>
                  <Avatar src={userAvatar(me)} size="xl" />
                  <div>
                    <p className='font-medium'>{me.name}</p>
                    <p className='text-secondary text-[14px]'>{me.email}</p>
                  </div>
                </div>
              )
            }
          </div>
          {
            !me && <BuyerInfoForm />
          }
        </div>
        {
          isFree && (
            <SubmitForm onComplete={() => redeemTickets()}>
              {(handleSubmit) => (
                <Button onClick={handleSubmit} loading={loadingRedeem}>Register</Button>
              )}
            </SubmitForm>
          )
        }
      </div>
    </div>
  );
}
