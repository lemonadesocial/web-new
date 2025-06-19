import { useState, useEffect } from "react";

import { Skeleton } from "$lib/components/core";

type OpenGraphImage = {
  url: string;
  type: string;
};

type OpenGraphData = {
  ogImage?: OpenGraphImage[];
  ogTitle?: string;
  ogDescription?: string;
  requestUrl?: string;
};

type UrlPreviewProps = {
  url: string;
};

export function UrlPreview({ url }: UrlPreviewProps) {
  const [ogData, setOgData] = useState<OpenGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOgData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(`/api/og/extractor?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch OG data');
        }
        
        const data = await response.json();
        setOgData(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchOgData();
    }
  }, [url]);

  if (loading) return <Skeleton animate className="h-20" />

  if (error || !ogData) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-accent-500 font-medium hover:underline"
      >
        {url}
      </a>
    );
  }

  const imageUrl = ogData.ogImage?.[0]?.url;

  if (imageUrl) {
    return (
      <div className="flex flex-col gap-3">
        <img
          src={imageUrl}
          className="rounded-sm object-cover border border-card-border h-full w-full aspect-video cursor-pointer"
          onClick={() => window.open(url, '_blank')}
        />
        {ogData.ogTitle && (
          <p className="text-sm">{ogData.ogTitle}</p>
        )}
      </div>
    );
  }

  if (ogData.ogTitle && ogData.ogDescription) {
    return (
      <div 
        className="border border-card-border rounded-sm p-4 cursor-pointer flex gap-3 justify-between"
        onClick={() => window.open(url, '_blank')}
      >
        <div>
        <p className="mb-2 line-clamp-2">{ogData.ogTitle}</p>
        <p className="text-sm text-tertiary line-clamp-3">{ogData.ogDescription}</p>
        </div>
        <i className="icon-arrow-outward text-quaternary size-4" />
      </div>
    );
  }

  return null;
}
