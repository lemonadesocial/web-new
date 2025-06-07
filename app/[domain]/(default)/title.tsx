'use client';

import { useAccount } from '$lib/hooks/useLens';

export function HomeTitle() {
  const { account } = useAccount();

  return (
    <h1 className="text-3xl leading-none font-semibold">Welcome {account && `, ${account?.username?.localName}`}</h1>
  );
}
