'use client';
import React from 'react';

import { useQuery } from '$lib/graphql/request';
import { lemonheadsClient } from '$lib/graphql/request/instances';
import { GetMintedsDocument, Minted_OrderBy, OrderDirection, GetMintedsQuery } from '$lib/graphql/generated/lemonheads/graphql';
import { Skeleton, Button } from '$lib/components/core';
import { TokenCard } from './TokenCard';

export function LemonheadsGallery() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [allItems, setAllItems] = React.useState<GetMintedsQuery['minteds']>([]);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [currentSkip, setCurrentSkip] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  const { data, loading } = useQuery(GetMintedsDocument, {
    variables: {
      first: 5,
      skip: 0,
      orderBy: Minted_OrderBy.TokenId,
      orderDirection: OrderDirection.Desc
    }
  }, lemonheadsClient);

  React.useEffect(() => {
    if (data?.minteds) {
      setAllItems(data.minteds);
      setHasMore(data.minteds.length === 5);
    }
  }, [data?.minteds]);

  const loadMore = React.useCallback(async () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    const nextSkip = currentSkip + 5;
    
    try {
      const result = await lemonheadsClient.query({
        query: GetMintedsDocument,
        variables: {
          first: 5,
          skip: nextSkip,
          orderBy: Minted_OrderBy.TokenId,
          orderDirection: OrderDirection.Desc
        }
      });
      
      if (result.data?.minteds) {
        setAllItems(prev => [...prev, ...result.data!.minteds]);
        setCurrentSkip(nextSkip);
        setHasMore(result.data!.minteds.length === 5);
      }
      
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more data:', error);
      setLoadingMore(false);
    }
  }, [lemonheadsClient, currentSkip, hasMore, loadingMore]);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = async () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const isNearEnd = scrollLeft + clientWidth + 240 >= scrollWidth - 100;
      
      if (isNearEnd && hasMore && !loadingMore) {
        loadMore();
      }
      
      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability();
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [allItems]);

  if (loading && !allItems.length) {
    return (
      <div className="flex overflow-x-auto no-scrollbar gap-0 rounded-md overflow-hidden border-2 border-card-border divide-card-border divide-x-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton key={index} className="min-w-60 h-60 rounded-none" />
        ))}
      </div>
    );
  }

  if (!allItems.length && !loading) return null;

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar gap-0 rounded-md border-2 border-card-border divide-card-border divide-x-2"
      >
        {allItems.map((minted) => (
          <TokenCard
            key={minted.tokenId}
            tokenId={minted.tokenId.toString()}
          />
        ))}
        {loadingMore && (
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`loading-${index}`} className="min-w-60 h-60 rounded-none" />
          ))
        )}
      </div>
      {canScrollLeft && (
        <Button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full z-10"
          variant="secondary"
          icon="icon-chevron-left"
          size="sm"
        />
      )}
      {canScrollRight && (
        <Button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full z-10"
          variant="secondary"
          icon="icon-chevron-right"
          size="sm"
        />
      )}
    </div>
  );
}
