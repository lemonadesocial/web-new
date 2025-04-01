import { Avatar, Input } from "$lib/components/core";
import { useMe } from "$lib/hooks/useMe";
import { userAvatar } from "$lib/utils/user";
import { useState } from "react";

export function RegistrationModal() {
  const me = useMe();

  const [name, setName] = useState('');

  return (
    <div className='h-screen w-screen bg-background/80 [backdrop-filter:var(--backdrop-filter)] flex pt-24 justify-center gap-12'>
      <div className='flex flex-col gap-8 w-[372]'>
        <div className='flex flex-col gap-6'>
          <div>
            <h3 className='font-semibold text-[24px] pb-4'>Your Info</h3>
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

            <Input placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
          </div>
        </div>
      </div>
    </div>
  );
}
