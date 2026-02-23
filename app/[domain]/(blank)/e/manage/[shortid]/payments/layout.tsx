import React from 'react';
import { PaymentsNav } from './PaymentsNav';

function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <PaymentsNav />
      {children}
    </>
  );
}

export default Layout;
