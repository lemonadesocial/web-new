'use client';

import { Button } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

export function LockFeature({ title, subtitle, icon }: { title: string; subtitle: string; icon?: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-8 pt-10 pb-20">
      <div className="flex flex-col justify-center items-center relative">
        {icon && <i className={twMerge('size-[184px] text-quaternary', icon)} />}

        <div className="bg-danger-500 rounded-full p-3 absolute bottom-0">
          <i className="icon-lock text-primary size-8 aspect-square" />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-tertiary text-center">
        <p className="font-title font-semibold! text-xl">{title}</p>
        <p>{subtitle}</p>
      </div>

      <Button variant="secondary" onClick={() => router.push('/lemonheads')}>
        Claim LemonHead
      </Button>
    </div>
  );
}

export function RightCol({
  options = { nft: true, treasury: true, invite: true },
}: {
  options?: { nft?: boolean; treasury?: boolean; invite?: boolean };
}) {
  const { data } = useLemonhead();

  return (
    <>
      <div className="md:hidden flex overflow-y-auto no-scrollbar gap-2">
        {options.nft && (
          <div className="flex gap-2.5 py-2.5 px-3 bg-overlay-secondary backdrop-blur-md rounded-md items-center flex-1 w-full min-w-fit">
            <img src={data?.image} className="rounded-sm size-8 aspect-square" />

            <div className="flex flex-col">
              <p className="text-sm">Share</p>
              <p className="text-xs text-quaternary">LemonHead #{data?.tokenId}</p>
            </div>
          </div>
        )}

        {options.treasury && <Treasury />}
        {options.invite && <InviteFriend locked={data && data.tokenId == 0} />}
      </div>

      <div className="hidden md:block w-full max-w-[296px]">
        <div className="sticky top-0 flex flex-col gap-4">
          {options.nft && (
            <div className="bg-overlay-secondary backdrop-blur-md p-4 rounded-md space-y-3 border">
              <img src={data?.image} className="rounded-sm" />
              <div className="flex justify-between">
                <p>LemonHead #{data?.tokenId}</p>
                <i className="icon-share size-5 aspect-square text-quaternary" />
              </div>
            </div>
          )}

          {options.treasury && <Treasury />}
          {options.invite && <InviteFriend locked={data && data.tokenId == 0} />}
        </div>
      </div>
    </>
  );
}

export function Treasury() {
  return (
    <>
      <div className="flex w-full min-w-fit items-center md:hidden p-2.5 border rounded-md gap-2.5">
        <div className="flex justify-center items-center rounded-sm bg-success-500/16 size-8 p-1.5 aspect-square">
          <i className="icon-account-balance-outline text-success-500" />
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Treasury</p>
          <p className="text-secondary text-sm">Unlocks at 5,000 LemonHeads.</p>
        </div>
      </div>

      <div className="hidden md:flex p-4 border rounded-md flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex justify-center items-center rounded-full bg-success-500/16 size-[48px] aspect-square">
            <i className="icon-account-balance-outline text-success-500" />
          </div>

          <div className="tooltip">
            <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
              <p>
                The LemonHeads treasury is building up. Once 5,000 LemonHeads are minted, it will unlock for proposals
                and voting—funding requests by the community, for the community.
              </p>
            </div>
            <i className="icon-info size-5 aspect-square text-quaternary" />
          </div>
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Treasury</p>
          <p className="text-secondary text-sm">Unlocks at 5,000 LemonHeads.</p>
        </div>
      </div>
    </>
  );
}

export function InviteFriend({ locked }: { locked?: boolean }) {
  const invited = 2;
  return (
    <>
      <div className="flex w-full min-w-fit items-center md:hidden p-2.5 border rounded-md gap-2.5">
        <div className="flex justify-center items-center rounded-sm bg-alert-400/16 size-8 p-1.5 aspect-square">
          <i className="icon-user-plus text-alert-400" />
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Treasury</p>
          <p className="text-secondary text-sm">Unlocks at 5,000 LemonHeads.</p>
        </div>
      </div>

      <div className="hidden md:flex p-4 border rounded-md flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex justify-center items-center rounded-full bg-alert-400/16 size-[48px] aspect-square">
            <i className="icon-user-plus text-alert-400" />
          </div>

          <div className="tooltip">
            <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
              <p>LemonHeads are currently invite-only. Each LemonHead can invite up to 5 wallets to mint their own.</p>
            </div>
            <i className="icon-info size-5 aspect-square text-quaternary" />
          </div>
        </div>

        <div className="flex flex-col gpa-1.5">
          <p>Invite a Friend</p>
          <p className="text-secondary text-sm">You have 2/5 invites left.</p>
        </div>

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

        {!locked && <Button variant="secondary">Invite</Button>}
      </div>
    </>
  );
}
