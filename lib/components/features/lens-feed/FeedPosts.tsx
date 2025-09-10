'use client';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useCallback } from 'react';

import { useFeedPosts } from '$lib/hooks/useLens';
import { accountAtom } from '$lib/jotai';

import { FeedPost } from './FeedPost';
import { FeedPostEmpty } from './FeedPostEmpty';
import { FeedPostLoading } from './FeedPostLoading';

type Props = {
  feedAddress?: string;
  authorId?: string;
  global?: boolean;
  showReposts?: boolean;
  onSelectPost?: (slug: string) => void;
};

export function FeedPosts({ feedAddress, authorId, global, showReposts, onSelectPost }: Props) {
  const { posts, isLoading, hasMore, loadMore } = useFeedPosts({ feedAddress, authorId, global });
  const account = useAtomValue(accountAtom);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore],
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

  if (isLoading && posts.length === 0) {
    return <FeedPostLoading />;
  }

  if (posts.length === 0) {
    return <FeedPostEmpty account={account} />;
  }

  return (
    <div className="space-y-4">
      {posts
        .filter((item: any) => !item.root)
        .map((post) => (
          <FeedPost key={post.slug} post={post} showRepost={showReposts} onSelect={() => onSelectPost?.(post.slug)} />
        ))}

      {hasMore && <div ref={observerRef}>{isLoading && <FeedPostLoading />}</div>}
    </div>
  );
}
