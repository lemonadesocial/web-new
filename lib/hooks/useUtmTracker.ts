'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import * as qs from 'query-string';

export function useUtmTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const utm: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utm[key] = value;
      }
    });

    if (Object.keys(utm).length) {
      Cookies.set('utm', qs.stringify(utm));
    }
  }, [searchParams]);
}
