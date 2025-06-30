'use client';
import { useAccount } from "$lib/hooks/useLens";

import { LensProfileCard } from "../lens-account/LensProfileCard";
import { LemonadeProfileCard } from "./LemonadeProfileCard";

export function ProfileCard() {
  const { account } = useAccount();

  if (account) return <LensProfileCard account={account} />;

  return <LemonadeProfileCard />;
}
