'use client';

import React from 'react';
import type { Space } from '$lib/graphql/generated/backend/graphql';

export type CommunityManageSpaceValue = {
  space: Space;
  hostname: string;
};

const CommunityManageSpaceContext = React.createContext<CommunityManageSpaceValue | null>(null);

export function CommunityManageSpaceProvider({
  space,
  hostname,
  children,
}: React.PropsWithChildren<CommunityManageSpaceValue>) {
  const value = React.useMemo(() => ({ space, hostname }), [space, hostname]);
  return (
    <CommunityManageSpaceContext.Provider value={value}>{children}</CommunityManageSpaceContext.Provider>
  );
}

export function useCommunityManageSpace(): CommunityManageSpaceValue | null {
  return React.useContext(CommunityManageSpaceContext);
}
