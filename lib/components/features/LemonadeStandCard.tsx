'use client';
import { useRouter } from "next/navigation";

import { useAccount } from "$lib/hooks/useLens";
import { useMe } from "$lib/hooks/useMe";

export function LemonadeStandCard() {
  const router = useRouter();
  const me = useMe();
  const { account } = useAccount();

  if (!me?._id || !account) return null;

  return (
    <div
      className="hidden lg:block rounded-md border p-4 space-y-4"
      onClick={() => router.push(`/settings`)}
    >
      <div className="flex justify-between">
        <div className="size-14 bg-warning-300/16 rounded-full flex items-center justify-center">
          <i className="icon-store size-8 text-warning-300" />
        </div>
        <i className="icon-arrow-outward text-quaternary" />
      </div>

      <div className="space-y-2">
        <p className="text-lg">Lemonade Stand</p>
        <p className="text-sm text-secondary">Your hub to host, create and manage everything you do on Lemonade.</p>
      </div>
    </div>
  );
}
