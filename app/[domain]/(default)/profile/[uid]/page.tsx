import React from 'react';

import UserProfileLayout from '$lib/components/features/user-profile/UserProfileLayout';
import Header from '$lib/components/layouts/header';

function Page({ children }: React.PropsWithChildren) {
  return <UserProfileLayout>{children}</UserProfileLayout>;
}

export default Page;
