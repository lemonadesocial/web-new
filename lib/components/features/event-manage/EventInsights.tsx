'use client';

import { Card } from '$lib/components/core';
import { useEvent } from './store';
import { TicketsSoldChart } from './insights/TicketsSoldChart';
import { PageViewsChart } from './insights/PageViewsChart';
import { PageViewsStats } from './insights/PageViewsStats';

export function EventInsights() {
  const event = useEvent();

  if (!event) return null;

  return (
    <div className="page mx-auto py-7 px-4 md:px-0">
      <div className="space-y-8">
        <TicketsSoldChart />
        <Card.Root>
          <Card.Content className="p-0">
            <PageViewsChart />
            <hr className="border-t" />
            <PageViewsStats />
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}

