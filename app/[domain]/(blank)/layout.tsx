import React from 'react';
import { DrawerContainer } from '$lib/components/core/dialog';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <DrawerContainer />
    </>
  );
}
