'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import UserProfileLayout from '$lib/components/features/user-profile/UserProfileLayout';
import { useSession } from '$lib/hooks/useSession';
import { useMe } from '$lib/hooks/useMe';

function Page({ children }: React.PropsWithChildren) {
  const session = useSession();
  const me = useMe();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!me && !session && mounted) {
      router.push('/');
    }
  }, [me, session, mounted]);

  return <UserProfileLayout>{children}</UserProfileLayout>;
}

export default Page;
