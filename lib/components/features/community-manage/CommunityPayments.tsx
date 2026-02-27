'use client';

import React from 'react';
import { ListSpacePaymentAccountsDocument, NewPaymentAccount, Space } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { CommunityVaultsSection } from './CommunityVaultsSection';
import { CommunityStripeSection } from './CommunityStripeSection';

export function CommunityPayments({ space }: { space: Space }) {
  const { data, loading, refetch } = useQuery(ListSpacePaymentAccountsDocument, {
    variables: { space: space._id },
    skip: !space._id,
  });

  const items = (data?.listSpacePaymentAccounts?.items ?? []) as NewPaymentAccount[];

  return (
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0 space-y-8">
      <CommunityVaultsSection space={space} items={items} loading={loading} refetch={refetch} />
      <hr className="border-t" />
      <CommunityStripeSection space={space} items={items} loading={loading} refetch={refetch} />
    </div>
  );
}
