'use client';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import { GetSpaceDocument, Space, SpaceCouncilMember } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { chainsMapAtom } from '$lib/jotai';
import { formatWallet, LemonheadNFTContract } from '$lib/utils/crypto';
import { Skeleton } from '$lib/components/core/skeleton';
import { toast } from '$lib/components/core';
import { LEMONHEAD_CHAIN_ID } from './mint/utils';
import { TitleSection } from '$app/[domain]/(blank)/s/lemonheads/shared';

export function CouncilMembers() {
  const { data, loading } = useQuery(GetSpaceDocument, {
    variables: {
      slug: 'lemonheads',
    },
  });

  if (loading) {
    return (
      <div className="flex md:grid grid-cols-5 gap-5 overflow-x-auto no-scrollbar">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="pt-6 px-4 pb-3 rounded-md flex flex-col items-center gap-3 bg-card">
            <Skeleton className="w-20 h-20 max-sm:mx-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  const councilMembers = (data?.getSpace as Space)?.council_members || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TitleSection className="text-2xl">Council</TitleSection>
        <div className="tooltip">
          <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
            <p>Five LemonHeads entrusted with shaping proposals and helping manage the community treasury.</p>
          </div>
          <i aria-hidden="true" className="icon-question size-5 aspect-square text-quaternary" />
        </div>
      </div>
      <div className="flex md:grid grid-cols-5 gap-5 overflow-x-auto no-scrollbar">
        {councilMembers.map((member) => (
          <CouncilMemberCard key={member.wallet} member={member} />
        ))}
        {councilMembers.length < 5 &&
          Array.from({ length: 5 - councilMembers.length }).map((_, index) => (
            <div
              key={index}
              className="pt-6 px-4 pb-3 rounded-md border-(length:--card-border-width) border-card-border flex flex-col items-center gap-3 bg-card"
            >
              <div
                className="w-20 h-20 max-sm:mx-7 rounded-full bg-primary/8 flex items-center justify-center cursor-pointer"
                onClick={() => toast.success('Coming soon')}
              >
                <i aria-hidden="true" className="icon-plus text-tertiary size-8" />
              </div>
              <p className="text-center text-tertiary">Apply</p>
            </div>
          ))}
      </div>
    </div>
  );
}

function CouncilMemberCard({ member }: { member: SpaceCouncilMember }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const chain = chainsMap[LEMONHEAD_CHAIN_ID];
      const contractAddress = chain?.lemonhead_contract_address;

      if (!contractAddress) {
        setLoading(false);
        return;
      }

      const provider = new ethers.JsonRpcProvider(chain.rpc_url);
      const contract = LemonheadNFTContract.attach(contractAddress).connect(provider) as ethers.Contract;

      const tokenId = await contract.getFunction('bounds')(member.wallet);
      if (tokenId <= 0) {
        setLoading(false);
        return;
      }

      const tokenUri = await contract.getFunction('tokenURI')(tokenId);
      const res = await fetch(tokenUri);
      const jsonData = await res.json();
      setImageData(jsonData.image);
      setLoading(false);
    };

    if (member.wallet && chainsMap) {
      fetchImage();
    }
  }, [member.wallet, chainsMap]);

  if (loading) {
    return (
      <div className="pt-6 px-4 pb-3 rounded-md border-(length:--card-border-width) border-card-border flex flex-col items-center gap-3 bg-card">
        <Skeleton className="w-20 h-20 max-sm:mx-7 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (!imageData) {
    return null;
  }

  return (
    <div className="pt-6 px-4 pb-3 rounded-md border-(length:--card-border-width) border-card-border flex flex-col items-center gap-3 bg-card">
      <img
        src={imageData}
        alt="Lemonhead NFT"
        className="min-w-20 size-20 max-sm:mx-7 aspect-square rounded-full object-cover border-(length:--card-border-width) border-card-border"
      />
      <p className="text-center">{member.user?.display_name || member.user?.username || formatWallet(member.wallet)}</p>
    </div>
  );
}

