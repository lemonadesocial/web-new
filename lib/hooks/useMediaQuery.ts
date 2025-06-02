import { useEffect, useState } from 'react';

// Tailwind's default breakpoints
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type BreakpointKey = keyof typeof breakpoints;

export function useMediaQuery(query: BreakpointKey | `${BreakpointKey}:${BreakpointKey}` | `max-${BreakpointKey}`): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const getQueryString = () => {
      if (query.startsWith('max-')) {
        const breakpoint = query.replace('max-', '') as BreakpointKey;
        return `(max-width: ${breakpoints[breakpoint] - 1}px)`;
      }

      if (query.includes(':')) {
        const [min, max] = query.split(':') as [BreakpointKey, BreakpointKey];
        return `(min-width: ${breakpoints[min]}px) and (max-width: ${breakpoints[max] - 1}px)`;
      }

      return `(min-width: ${breakpoints[query as BreakpointKey]}px)`;
    };

    const mediaQuery = window.matchMedia(getQueryString());
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}
