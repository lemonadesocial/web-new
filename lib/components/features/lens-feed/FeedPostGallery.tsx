import { useState } from 'react';

import { Button } from '$lib/components/core';

export function FeedPostGallery({ attachments }: { attachments: string[] }) {
  const [current, setCurrent] = useState(0);

  if (!attachments?.length) return null;

  if (attachments.length === 1) {
    return (
      <img
        src={attachments[0]}
        alt="Post attachment"
        className="rounded-sm object-cover border border-card-border h-full w-full aspect-video"
      />
    );
  }

  const prev = () => setCurrent((c) => (c === 0 ? attachments.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === attachments.length - 1 ? 0 : c + 1));

  return (
    <div className="relative flex flex-col items-center aspect-video">
      <img
        src={attachments[current]}
        alt={`Post attachment ${current + 1}`}
        className="rounded-sm object-cover border border-card-border h-full w-full"
      />
      {current > 0 && (
        <div className="absolute inset-y-0 left-[14px] flex items-center">
          <Button
            type="button"
            onClick={prev}
            icon="icon-chevron-left"
            variant="secondary"
            className="rounded-full"
            size="sm"
          />
        </div>
      )}
      <div className="absolute inset-y-0 right-[14px] flex items-center">
        <Button
          type="button"
          onClick={next}
          icon="icon-chevron-right"
          variant="secondary"
          className="rounded-full"
          size="sm"
        />
      </div>
      <div className="flex gap-1.5 mt-3">
        {attachments.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-1.5 h-1.5 rounded-full ${idx === current ? 'bg-primary' : 'bg-tertiary'}`}
          />
        ))}
      </div>
    </div>
  );
}
