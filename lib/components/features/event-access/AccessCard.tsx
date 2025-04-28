import React, { useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';

import { useMe } from "$lib/hooks/useMe";
import { userAvatar } from "$lib/utils/user";
import { Card, Avatar } from "$lib/components/core";

export function AccessCard({
  children,
  start,
}: {
  children: React.ReactNode;
  start?: string;
}) {
  const me = useMe();
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!start) {
      setLabel('');
      return;
    }

    const now = new Date();
    const target = new Date(start);
    if (target <= now) {
      setLabel('');
      return;
    }

    const d = intervalToDuration({ start: now, end: target });
    const days = d.days ?? 0;
    if (days > 1) {
      setLabel(`${days}d`);
      return;
    }

    const hours = days * 24 + (d.hours ?? 0);
    if (hours > 0) {
      let text = `${hours}h`;
      const minutes = d.minutes ?? 0;
      if (minutes > 0) {
        text += ` ${minutes}m`;
      }
      setLabel(text);
      return;
    }

    const minutes = d.minutes ?? 0;
    if (minutes > 0) {
      let text = `${minutes}m`;
      const seconds = d.seconds ?? 0;
      if (seconds > 0) {
        text += ` ${seconds}s`;
      }
      setLabel(text);
      return;
    }

    const seconds = d.seconds ?? 0;
    if (seconds > 0) {
      setLabel(`${seconds}s`);
      return;
    }

    setLabel('');
  }, [start]);

  return (
    <Card.Root className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Avatar src={userAvatar(me)} className="size-12" />
        {label && (
          <div className="px-2 py-1 bg-primary/8 rounded-full">
            <p className="text-xs text-tertiary">Starts in <span className="text-warning-300">{label}</span></p>
          </div>
        )}
      </div>
      {children}
    </Card.Root>
  );
}