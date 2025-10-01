'use client';
import React from 'react';

import { useQuery } from '$lib/graphql/request';
import { lemonheadsClient } from '$lib/graphql/request/instances';
import { GetMintedsDocument, Minted_OrderBy, OrderDirection } from '$lib/graphql/generated/lemonheads/graphql';
import { Skeleton, Button } from '$lib/components/core';
import { TokenCard } from './TokenCard';

const LIMIT = 20;

export function LemonheadsGallery() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const [canFetchMore, setCanFetchMore] = React.useState(true);

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const { data, loading, fetchMore } = useQuery(
    GetMintedsDocument,
    {
      variables: {
        first: LIMIT,
        skip: 0,
        orderBy: Minted_OrderBy.TokenId,
        orderDirection: OrderDirection.Desc,
      },
    },
    lemonheadsClient,
  );

  const onLoadMore = () => {
    fetchMore({
      variables: { first: LIMIT, skip: data?.minteds?.length },
      updateQuery: (existing, incomes) => {
        if (existing?.minteds && incomes?.minteds?.length) {
          const minteds = existing?.minteds || [];
          return { __typename: 'Query', minteds: [...minteds, ...incomes.minteds] };
        }

        if (!incomes.minteds.length) setCanFetchMore(false);

        return existing;
      },
    });
  };

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);

      const isNearEnd = scrollLeft + clientWidth + 240 >= scrollWidth;

      if (isNearEnd && !loading && mounted && data?.minteds.length && canFetchMore) {
        onLoadMore();
      }
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollability();
      setMounted(true);
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [scrollContainerRef.current, data?.minteds.length, canFetchMore, loading]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = async () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const isNearEnd = scrollLeft + clientWidth + 240 >= scrollWidth;

      if (isNearEnd && !loading && mounted && data?.minteds.length && canFetchMore) {
        onLoadMore();
      }

      scrollContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto no-scrollbar gap-0 rounded-md border-2 border-card-border divide-card-border divide-x-2"
      >
        {data?.minteds?.map((minted, idx) => <TokenCard key={idx} tokenId={minted.tokenId.toString()} />)}
        {loading && (
          <div className="flex w-full h-60 divide-x-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={`loading-${index}`} className="size-60 aspect-square rounded-none" animate />
            ))}
          </div>
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
