'use client';
import React from 'react';

export function useIOSVisibility() {
  const [isVisible, setIsVisible] = React.useState(!document.hidden);
  const [wasReloaded, setWasReloaded] = React.useState(false);
  const [lastVisibleTime, setLastVisibleTime] = React.useState(Date.now());
  // const pageLoadTime = React.useRef(Date.now());

  React.useEffect(() => {
    let wasVisible = !document.hidden;

    const handleVisibilityChange = () => {
      const isNowVisible = !document.hidden;
      const currentTime = Date.now();

      if (!wasVisible && isNowVisible) {
        // Coming back to foreground
        const timeAway = currentTime - lastVisibleTime;

        // On iPhone, if away for more than ~30 seconds,
        // the page might have been suspended
        const likelyReloaded = timeAway > 30000;

        setIsVisible(true);
        setWasReloaded(likelyReloaded);
        setLastVisibleTime(currentTime);

        console.log('iPhone Safari visible again');
        console.log(`Time away: ${Math.round(timeAway / 1000)}s`);
        console.log(`Likely reloaded: ${likelyReloaded}`);
      } else if (wasVisible && !isNowVisible) {
        // Going to background
        setIsVisible(false);
        setLastVisibleTime(currentTime);
        console.log('iPhone Safari backgrounded');
      }

      wasVisible = isNowVisible;
    };

    // Primary detection method for iPhone
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Fallback methods (less reliable on iPhone but still useful)
    const handlePageShow = (event: any) => {
      if (event.persisted) {
        // Page was restored from back/forward cache
        console.log('iPhone: Page restored from cache');
        setWasReloaded(false);
      } else {
        // Page was fully reloaded
        console.log('iPhone: Page was reloaded');
        setWasReloaded(true);
      }
    };

    const handlePageHide = () => {
      setLastVisibleTime(Date.now());
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [lastVisibleTime]);

  return {
    isVisible,
    wasReloaded,
    lastVisibleTime,
    timeAway: Date.now() - lastVisibleTime,
  };
}

// Hook specifically for handling iPhone app returns
export function useAppReturn(onReturn: any) {
  const returnHandled = React.useRef(false);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !returnHandled.current) {
        returnHandled.current = true;
        onReturn?.();

        // Reset after a delay to allow multiple detections
        setTimeout(() => {
          returnHandled.current = false;
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onReturn]);
}
