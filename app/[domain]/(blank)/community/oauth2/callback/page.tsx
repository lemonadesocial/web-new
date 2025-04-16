'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useOAuth2 } from '$lib/hooks/useOAuth2';
import { useSession } from '$lib/hooks/useSession';

export default function Page() {
  const router = useRouter();
  const { processSignIn } = useOAuth2();
  const session = useSession();
  const hasProcessedSignIn = useRef(false);

  useEffect(() => {
    if (!session && !hasProcessedSignIn.current) {
      hasProcessedSignIn.current = true;
      processSignIn();
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      router.push(session.returnTo || '/');
    }
  }, [session]);

  return 'Redirecting...';
}
