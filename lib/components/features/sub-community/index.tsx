"use client";
import React from "react";

import { Button } from "$lib/components/core/button/button";
import { PublicSpace } from "$lib/graphql/generated/backend/graphql";
import CommunityCard from "../community/CommunityCard";

const SubCommunity = ({ subSpaces }: { subSpaces: PublicSpace[]; }) => {
  const [activeTab, setActiveTab] = React.useState<'all' | 'subscriptions'>('all');

  const filteredSubSpaces = subSpaces.filter((space) => {
    if (activeTab === 'all') return true;
    return space.followed;
  });

  return (
    <div className="page relative py-6 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl text-primary md:text-3xl font-semibold pb-2"> Featured Hubs </h1>
        <p className="text-base text-tertiary font-medium">A closer look at all the hubs linked to this community. Discover new events, people, and ideas.</p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button size="sm" variant={activeTab === 'all' ? 'secondary' : 'flat'} onClick={() => setActiveTab('all')}>All</Button>
          <Button size="sm" variant={activeTab === 'subscriptions' ? 'secondary' : 'flat'} onClick={() => setActiveTab('subscriptions')}>Subscriptions</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubSpaces.map((space) => (
            <CommunityCard key={space._id} space={space as PublicSpace} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCommunity;
