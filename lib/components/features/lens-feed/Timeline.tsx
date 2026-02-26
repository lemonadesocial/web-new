'use client';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useCallback } from 'react';

import { useTimeline } from '$lib/hooks/useLens';
import { accountAtom } from '$lib/jotai';

import { FeedPost } from './FeedPost';
import { FeedPostEmpty } from './FeedPostEmpty';
import { FeedPostLoading } from './FeedPostLoading';

type Props = {
  account?: string;
  onSelectPost?: (slug: string) => void;
};

export function Timeline({ account, onSelectPost }: Props) {
  const { timelineItems, isLoading, hasMore, loadMore } = useTimeline({ account });
  const currentAccount = useAtomValue(accountAtom);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  if (isLoading && timelineItems.length === 0) {
    return <FeedPostLoading />;
  }

  if (timelineItems.length === 0) {
    return <FeedPostEmpty account={currentAccount} />;
  }

  return (
    <div className="space-y-4">
      {timelineItems
        .filter((item) => item.primary && !item.primary.root)
        .map((item) => (
          <FeedPost 
            key={item.primary.slug} 
            post={item.primary} 
            showRepost={true} 
            onSelect={() => onSelectPost?.(item.primary.slug)} 
          />
        ))}
      
      {hasMore && (
        <div ref={observerRef}>
          {isLoading && <FeedPostLoading />}
        </div>
      )}
    </div>
  );
} 