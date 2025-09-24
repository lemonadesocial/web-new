'use client';
import React from 'react';

import { useQuery } from '$lib/graphql/request';
import { lemonheadsClient } from '$lib/graphql/request/instances';
import { GetMintedsDocument, Minted_OrderBy, OrderDirection } from '$lib/graphql/generated/lemonheads/graphql';
import { Skeleton, Button } from '$lib/components/core';
import { TokenCard } from './TokenCard';

export function LemonheadsGallery() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const { data, loading } = useQuery(GetMintedsDocument, {
    variables: {
      first: 20,
      orderBy: Minted_OrderBy.TokenId,
      orderDirection: OrderDirection.Desc
    }
  }, lemonheadsClient);

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

  const scrollRight = () => {
    if (scrollContainerRef.current) {
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
  }, [data]);

  if (loading) {
    return (
      <div className="flex overflow-x-auto no-scrollbar gap-0 rounded-md overflow-hidden border-2 border-card-border divide-card-border divide-x-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <Skeleton key={index} className="min-w-60 h-60 rounded-none" />
        ))}
      </div>
    );
  }

  const minteds = data?.minteds || [];

  if (!minteds.length) return null;

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar gap-0 rounded-md border-2 border-card-border divide-card-border divide-x-2"
      >
        {minteds.map((minted) => (
          <TokenCard
            key={minted.tokenId}
            tokenId={minted.tokenId.toString()}
          />
        ))}
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
