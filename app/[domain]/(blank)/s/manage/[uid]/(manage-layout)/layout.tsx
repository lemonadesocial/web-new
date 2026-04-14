import React from 'react';

import ManageLayout from '$lib/components/features/ai/manage/ManageLayout';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <ManageLayout layoutType="community" availableTabs={['manage', 'design', 'preview']}>
      {children}
    </ManageLayout>
  );
}
