'use client';
import React from 'react';

export function useScrollable(callback?: () => void) {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const divElement = container.current;
    if (divElement) {
      divElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    if (container.current) {
      const { scrollTop, clientHeight, scrollHeight } = container.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
      if (atBottom) callback?.();
    }
  };

  return { ref: container };
}
