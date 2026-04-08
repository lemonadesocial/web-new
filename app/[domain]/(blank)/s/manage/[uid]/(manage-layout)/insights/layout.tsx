import React from 'react';

import { InsightsNav } from './InsightsNav';

function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <InsightsNav />
      {children}
    </>
  );
}

export default Layout;
