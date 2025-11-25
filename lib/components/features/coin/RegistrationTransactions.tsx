'use client';

import { EmptyState } from './EmptyState';

export function RegistrationTransactions() {
  return (
    <EmptyState
      icon="icon-lab-profile"
      title="No Transactions"
      subtitle="Trades and activity for this coin will appear here once things get moving."
    />
  );
}
    