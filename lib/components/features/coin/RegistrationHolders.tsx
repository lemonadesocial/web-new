'use client';

import { EmptyState } from './EmptyState';

export function RegistrationHolders() {
  return (
    <EmptyState
      icon="icon-user-group-rounded"
      title="No Holders"
      subtitle="Once people start buying or receiving this coin, you’ll see the holder list here."
    />
  );
}
    