'use client';

import { useMemo } from 'react';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { ListSpacePaymentAccountsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { filterDirectPaymentAccounts } from '$lib/utils/event';

export function useEventDirectPaymentAccounts(event: Event | null | undefined) {
  const spaceId = event?.space ?? undefined;
  const { data: spaceData, loading: spaceLoading } = useQuery(ListSpacePaymentAccountsDocument, {
    variables: { space: spaceId! },
    skip: !spaceId,
  });

  const directPaymentAccounts = useMemo(() => {
    const eventAccounts = filterDirectPaymentAccounts(event?.payment_accounts_expanded ?? []);
    const spaceItems = spaceData?.listSpacePaymentAccounts?.items ?? [];
    const spaceDirect = filterDirectPaymentAccounts(spaceItems as NewPaymentAccount[]);
    const seen = new Set(eventAccounts.map((a) => a._id));
    const fromSpace = spaceDirect.filter((a) => !seen.has(a._id));
    return [...eventAccounts, ...fromSpace];
  }, [event?.payment_accounts_expanded, spaceData?.listSpacePaymentAccounts?.items]);

  return { directPaymentAccounts, loading: spaceLoading };
}
