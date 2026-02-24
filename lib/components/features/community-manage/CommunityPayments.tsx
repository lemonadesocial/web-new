'use client';

import React from 'react';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { CommunityVaultsSection } from './CommunityVaultsSection';
import { CommunityStripeSection } from './CommunityStripeSection';

export function CommunityPayments({ space }: { space: Space }) {
  return (
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0 space-y-8">
      <CommunityVaultsSection space={space} />
      <hr className="border-t" />
      <CommunityStripeSection space={space} />
    </div>
  );
}
