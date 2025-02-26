import React from 'react';
import { Space } from '$lib/generated/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { Button } from '$lib/components/core/button';

interface SpaceHeaderProps {
  space?: Space | null;
}

export function SpaceHeader({ space }: SpaceHeaderProps) {
  return (
    <>
      <div className="relative w-full h-96 overflow-hidden">
        <div className="relative w-full h-full">
          <div className="relative">
            <img
              src={generateUrl(space?.image_cover_expanded)}
              alt="Nightclub scene with crowd and performers"
              className="aspect-[3.5/1] object-cover object-cover rounded-md"
            />

            {/* Blue laser overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-black/40 mix-blend-overlay"></div>
          </div>
          {/* DJ booth thumbnail in bottom left */}
          <div className="absolute bottom-4 outline-6 outline-background w-32 h-32 rounded-md overflow-hidden shadow-lg">
            {space?.image_cover_expanded && (
              <img
                className="w-full h-full outline outline-tertiary/[0.04] rounded-md"
                src={generateUrl(space?.image_avatar_expanded)}
                alt={space.title}
              />
            )}
          </div>

          {/* Subscribe button */}
          <div className="absolute bottom-4 right-4">
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </div>

      <div>content</div>
    </>
  );
}
