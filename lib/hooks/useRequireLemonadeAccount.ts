'use client';

import React from 'react';

import { useMe } from '$lib/hooks/useMe';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';

type Options = {
  dismissible?: boolean;
};

export function useRequireLemonadeAccount({ dismissible = false }: Options = {}) {
  const me = useMe();
  const session = useSession();
  const signIn = useSignIn();

  const [mounted, setMounted] = React.useState(false);
  const promptedRef = React.useRef(false);
  const isAuthenticated = !!(me || session);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || isAuthenticated || promptedRef.current) return;

    promptedRef.current = true;
    signIn(dismissible);
  }, [dismissible, isAuthenticated, mounted, signIn]);

  React.useEffect(() => {
    if (isAuthenticated) promptedRef.current = false;
  }, [isAuthenticated]);

  return { isAuthenticated, me, session };
}
