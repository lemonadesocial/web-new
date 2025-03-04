'use client';
import React from 'react';

import { Button, Spacer } from '$lib/components/core';
import { Space } from '$lib/generated/graphql';
import { generateUrl } from '$lib/utils/cnd';

import { COMMUNITY_SOCIAL_LINKS } from './constants';

interface HeroSectionProps {
  space?: Space | null;
}

export function HeroSection({ space }: HeroSectionProps) {
  return (
    <>
      <div className="relative w-full h-44 md:h-96 overflow-hidden">
        {space?.image_cover && (
          <img
            src={generateUrl(space?.image_cover_expanded, {
              resize: { width: 1080, height: 1080 * 3.5, fit: 'contain' },
            })}
            alt={space?.title as string}
            className="aspect-[3.5/1] object-cover object-cover rounded-md w-full"
          />
        )}

        <div className="absolute bottom-8 md:bottom-4 outline-6 outline-background size-16 md:size-32 rounded-md overflow-hidden shadow-lg">
          {space?.image_avatar && (
            <img
              className="w-full h-full outline outline-tertiary/[0.04] rounded-md"
              src={generateUrl(space?.image_avatar_expanded, { resize: { width: 128, height: 128 } })}
              alt={space?.title}
            />
          )}
        </div>

        {/* Subscribe button */}
        <div className="absolute bottom-4 right-4">
          <Button variant="secondary">Subscribe</Button>
        </div>
      </div>

      <Spacer className="h-6" />
      <div>
        <h1 className="text-3xl font-semibold">{space?.title}</h1>
        <p className="text-md text-tertiary/[0.8] font-medium">{space?.description}</p>
        <Spacer className="h-3" />
        <div className="flex gap-3">
          {COMMUNITY_SOCIAL_LINKS.filter((item) => space?.[item.key as keyof Space]).map((item) => (
            <Button
              key={item.key}
              aria-label={item.key}
              variant="flat"
              icon={item.icon}
              className="text-tertiary/[0.56]"
              onClick={() => window.open(`${item.prefix}${space?.[item.key as keyof Space]}`, '_blank')}
            />
          ))}
        </div>
      </div>
    </>
  );
}
