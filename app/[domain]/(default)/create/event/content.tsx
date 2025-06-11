'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import clsx from 'clsx';

import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useSession } from '$lib/hooks/useSession';
import { useEventTheme } from '$lib/components/features/theme-builder/provider';

export function Content() {
  const signIn = useSignIn();
  const session = useSession();
  const me = useMe();

  const [state] = useEventTheme();

  const { control } = useForm({});

  React.useEffect(() => {
    if (!session && !me) signIn();
  }, [me, session]);

  return (
    <div className={clsx('flex gap-[72px]', state.theme && state.config.color)}>
      <div className="hidden md:flex w-[296px] flex-col gap-6">
        <div className="flex flex-col gap-4">Image here</div>
      </div>
    </div>
  );
}
