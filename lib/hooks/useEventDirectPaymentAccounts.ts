'use client';

import { useMemo } from 'react';
import { Event, NewPaymentAccount } from '$lib/graphql/generated/backend/graphql';
import { filterDirectPaymentAccounts } from '$lib/utils/event';

export function useEventDirectPaymentAccounts(event: Event | null | undefined) {
  const directPaymentAccounts = useMemo(() => {
    return filterDirectPaymentAccounts(event?.payment_accounts_expanded ?? []);
  }, [event?.payment_accounts_expanded]);

  return { directPaymentAccounts };
}
