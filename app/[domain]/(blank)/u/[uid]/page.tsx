import React from 'react';

import UserProfileLayout from '$lib/components/features/user-profile/UserProfileLayout';
import Header from '$lib/components/layouts/header';

function Page({ children }: React.PropsWithChildren) {
  return (
    <main className="h-dvh overflow-auto">
      <Header />
      <div className="page flex mx-auto">
        <UserProfileLayout>{children}</UserProfileLayout>
      </div>
    </main>
  );
}

export default Page;
