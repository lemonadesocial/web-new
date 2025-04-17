'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useOAuth2 } from '$lib/hooks/useOAuth2';
import { useSession } from '$lib/hooks/useSession';

export default function Page() {
  const router = useRouter();
  const { processSignOut } = useOAuth2();
  const session = useSession();
  const hasProcessedSignOut = useRef(false);

  useEffect(() => {
    if (!session && !hasProcessedSignOut.current) {
      hasProcessedSignOut.current = true;
      processSignOut();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session]);

  return 'Redirecting...';
}
