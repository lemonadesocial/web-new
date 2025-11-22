'use client';

import { useState, useEffect } from "react";
import { StatItem } from "./StatItem";
import { useAtomValue } from "jotai";
import { listChainsAtom } from "$lib/jotai";
import { FlaunchClient } from "$lib/services/coin/FlaunchClient";
import { Chain } from "$lib/graphql/generated/backend/graphql";
import { formatWallet } from "$lib/utils/crypto";

interface CoinPageProps {
  network: string;
  address: string;
}

export function CoinPage({ network, address }: CoinPageProps) {
  const listChains = useAtomValue(listChainsAtom);
  const chain = listChains.find(chain => chain.code_name === network);


  return (
    <div className="flex flex-col gap-4">
      <Stats chain={chain!} address={address} />
      <BuybackCharging />
    </div>
  );
}

function Stats({ chain, address }: { chain: Chain; address: string }) {
  const [owner, setOwner] = useState<string>('');
  const flaunchClient = new FlaunchClient(chain, address);

  useEffect(() => {
    const fetchOwner = async () => {
      const ownerAddress = await flaunchClient.getOwnerOf();
      setOwner(ownerAddress);
    };

    fetchOwner();
  }, [chain, address]);

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatItem title="Owner" value={owner ? formatWallet(owner) : "Loading..."} />
      <StatItem title="Owner" value="johndoe.eth" />
      <StatItem title="Owner" value="johndoe.eth" />
      <StatItem title="Owner" value="johndoe.eth" />
      <StatItem title="Owner" value="johndoe.eth" />
      <StatItem title="Owner" value="johndoe.eth" />
      <StatItem title="Owner" value="johndoe.eth" />
      <StatItem title="Owner" value="johndoe.eth" />
    </div>
  )
}

function BuybackCharging({
  amount = "0.0061 ETH",
  progress = 0.17
}: {
  amount?: string;
  progress?: number;
}) {
  const progressPercentage = Math.min(100, Math.max(0, progress * 100));

  return (
    <div className="py-3 px-4 rounded-md border-card-border bg-card space-y-2">
      <div className="flex justify-between items-center">
        <p>Buyback Charging</p>
        <p className="text-alert-400">{amount}</p>
      </div>
      <div className="relative w-full h-2 rounded-full bg-quaternary overflow-hidden">
        <div
          className="h-full rounded-full bg-alert-400 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}