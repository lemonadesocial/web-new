'use client';
import React from 'react';

export function HorizontalScroll({ children }: React.PropsWithChildren) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const spacerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const updateWidth = () => {
      wrapper.style.position = '';
      wrapper.style.left = '';
      wrapper.style.width = '';
      wrapper.style.top = '';

      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect();
        const leftOffset = rect.left;
        const topOffset = rect.top;
        const viewportWidth = window.innerWidth;
        const height = rect.height;

        if (spacerRef.current) {
          spacerRef.current.style.height = `${height}px`;
        }

        wrapper.style.position = 'fixed';
        wrapper.style.left = `${leftOffset}px`;
        wrapper.style.top = `${topOffset}px`;
        wrapper.style.width = `${viewportWidth - leftOffset}px`;
        wrapper.style.zIndex = '1';
      });
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', updateWidth);
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="relative">
      <div ref={spacerRef} />
      <div ref={wrapperRef} className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

