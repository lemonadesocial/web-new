import React, { useState, useEffect, useRef } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import * as Sentry from '@sentry/nextjs';
import { Menu, Input } from '$lib/components/core';

const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!);

type GifPickerProps = {
  onSelectGif: (gifUrl: string) => void;
  trigger?: React.ReactNode;
};

export function GifPicker({ onSelectGif, trigger }: GifPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchGifs = async (searchQuery: string, offsetValue: number, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = searchQuery.trim() 
        ? await gf.search(searchQuery, { offset: offsetValue, limit: 20 })
        : await gf.trending({ offset: offsetValue, limit: 20 });

      const newGifs = response.data;

      
      if (reset || searchQuery) {
        setGifs(newGifs);
      } else {
        setGifs(prev => [...prev, ...newGifs]);
      }
      
      setHasMore(newGifs.length === 20);
      setOffset(offsetValue + newGifs.length);
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setOffset(0);
      setGifs([]);
      fetchGifs(value, 0, true);
    }, 300);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchGifs(searchTerm, offset, false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMore();
    }
  };

  const handleGifClick = (gif: IGif) => {
    const gifUrl = gif.images.original.url;
    setSearchTerm('');
    onSelectGif(gifUrl);
  };

  useEffect(() => {
    fetchGifs('', 0, true);
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Menu.Root placement="bottom-start">
      <Menu.Trigger className="flex">
        {trigger || <i aria-hidden="true" className="icon-gif size-5 text-[#FACC15]" />}
      </Menu.Trigger>
      <Menu.Content className="w-[480px] h-[500px] p-0">
        {({ toggle }) => (
          <div className="flex flex-col h-full">
              <Input
                placeholder="Search GIFs..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="border-none"
              />
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto"
              onScroll={handleScroll}
            >
              <div className="grid grid-cols-2 p-1 gap-1">
                {gifs.map((gif) => (
                  <div
                    key={gif.id}
                    className=""
                    onClick={() => {
                      handleGifClick(gif);
                      toggle();
                    }}
                  >
                    <img
                      src={gif.images.fixed_height.url}
                      alt={gif.title}
                      className="w-full aspect-video object-cover border rounded-sm"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              {loading && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--color-primary)]"></div>
                </div>
              )}
              {!hasMore && gifs.length > 0 && (
                <div className="text-center p-4 text-sm text-[var(--color-text-secondary)]">
                  No more GIFs
                </div>
              )}
            </div>
          </div>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}