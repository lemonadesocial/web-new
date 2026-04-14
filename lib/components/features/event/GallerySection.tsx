import React from 'react';

import { Divider, Skeleton } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';

export function GallerySection({ 
  event, 
  loading,
  title = 'Gallery'
}: { 
  event: Event; 
  loading?: boolean;
  title?: string;
}) {
  if (loading) return <GallerySectionSkeleton />;

  const photos = event?.new_new_photos_expanded?.slice(1) ?? [];

  if (!photos.length) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-secondary text-sm">
          {photos.length} {photos.length > 1 ? 'Photos' : 'Photo'}
        </p>
      </div>
      <Divider className="h-1 w-full mb-2" />
      <div className="flex md:grid md:grid-cols-3 gap-3 overflow-auto no-scrollbar">
        {photos.map((photo, idx) => (
          <img
            key={idx}
            src={generateUrl(photo)}
            className="rounded-xl aspect-square object-contain border size-[144] md:size-full"
          />
        ))}
      </div>
    </div>
  );
}

function GallerySectionSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Skeleton animate className="h-4 w-24" />
      <Divider className="h-1 w-full mb-2" />
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, num) => (
          <Skeleton key={num} className="h-[157] aspect-square" />
        ))}
      </div>
    </div>
  );
}
