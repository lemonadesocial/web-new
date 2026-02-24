'use client';

import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import * as Sentry from '@sentry/nextjs';

import { useSession } from './useSession';

const ANONYMOUS_ID_COOKIE = 'lemonade_anonymous_id';
const INTERVAL = 60000;

export function useTracker(eventId?: string) {
  const [anonymousId, setAnonymousId] = useState<string | undefined>(
    () => Cookies.get(ANONYMOUS_ID_COOKIE)
  );
  const session = useSession();
  const previousEventIdRef = useRef<string | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (anonymousId) return;

    const id = crypto.randomUUID();
    Cookies.set(ANONYMOUS_ID_COOKIE, id, { expires: 365 });
    setAnonymousId(id);
  }, [anonymousId]);

  useEffect(() => {
    if (!anonymousId || !eventId) return;

    const track = async (isTimer = true) => {
      const { href } = window.location;

      const isView = previousEventIdRef.current !== eventId;
      previousEventIdRef.current = eventId;

      if (!isTimer && !isView) return;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_LMD_BE}/track`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            anonymous_id: anonymousId,
            href,
            is_view: isView,
            meta_event_id: eventId,
          }),
        });
      } catch (err) {
        Sentry.captureException(err);
      }
    };

    if (typeof window !== 'undefined') {
      track(false);
      timerRef.current = setInterval(track, INTERVAL);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [anonymousId, eventId, session]);
}
