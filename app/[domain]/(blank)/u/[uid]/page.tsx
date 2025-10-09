import React from 'react';

import UserProfileLayout from '$lib/components/features/users-profile/UserProfileLayout';
import Header from '$lib/components/layouts/header';

function Page({ children }: React.PropsWithChildren) {
  return (
    <main>
      <Header />
      <div className="page flex mx-auto">
        <UserProfileLayout>{children}</UserProfileLayout>
      </div>
    </main>
  );
}

export default Page;
