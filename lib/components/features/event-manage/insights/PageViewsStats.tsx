'use client';

import { useMemo } from 'react';

import { Skeleton } from '$lib/components/core';
import { GetEventTopViewsDocument, GetEventViewStatsDocument, ViewsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { getTimeAgo } from '$lib/utils/date';
import { useEvent } from '../store';

const SOURCE_LABELS: Record<string, string> = {
  lemonade: 'Lemonade',
  twitter: 'Twitter (X)',
  x: 'Twitter (X)',
  farcaster: 'Farcaster',
  lens: 'Lens',
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  email: 'Email',
  newsletter: 'Newsletter',
};

export function PageViewsStats() {
  const event = useEvent();

  const ranges = useMemo(() => {
    const now = new Date();
    const end = now.toISOString();

    return [
      {
        start: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        end,
      },
      {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end,
      },
      {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end,
      },
    ];
  }, []);

  const { data, loading } = useQuery(GetEventViewStatsDocument, {
    variables: {
      event: event?._id || '',
      ranges,
    },
    skip: !event?._id,
  });

  const counts = data?.getEventViewStats?.counts || [];
  const [count24h, count7d, count30d] = counts;

  const { data: viewsData, loading: viewsLoading } = useQuery(ViewsDocument, {
    variables: {
      event: event?._id || '',
      limit: 5,
    },
    skip: !event?._id,
  });

  const views = viewsData?.getEventLatestViews?.views || [];

  const { data: topViewsData, loading: topViewsLoading } = useQuery(GetEventTopViewsDocument, {
    variables: {
      event: event?._id || '',
      cityLimit: 5,
      sourceLimit: 5,
    },
    skip: !event?._id,
  });

  const topViews = topViewsData?.getEventTopViews;
  const total = topViews?.total || 0;
  const byCities = topViews?.by_city || [];
  const bySources = topViews?.by_source || [];

  const getSourceLabel = (source: string | null | undefined) => {
    if (!source) return 'Direct';
    const key = source.toLowerCase();
    return SOURCE_LABELS[key] || source;
  };

  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2">
      <div className="p-4 space-y-6 border-b md:border-r md:border-b-0">
        <div className="space-y-3">
          <p>Page Views</p>
          <div className="grid grid-cols-3">
            <div>
              <p className="text-sm text-tertiary">24 hours</p>
              {loading ? (
                <Skeleton animate className="h-8 w-16" />
              ) : (
                <p className="text-2xl">{count24h || 0}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-tertiary">7 days</p>
              {loading ? (
                <Skeleton animate className="h-8 w-16" />
              ) : (
                <p className="text-2xl">{count7d || 0}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-tertiary">30 days</p>
              {loading ? (
                <Skeleton animate className="h-8 w-16" />
              ) : (
                <p className="text-2xl">{count30d || 0}</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <p>Live Traffic</p>
          <div className="space-y-2">
            {viewsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-md border-card-border bg-card">
                  <Skeleton animate className="size-5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton animate className="h-4 w-32" />
                    <Skeleton animate className="h-3 w-24" />
                  </div>
                  <Skeleton animate className="h-4 w-12" />
                </div>
              ))
            ) : views.length === 0 ? (
              <p className="text-sm text-tertiary">No recent views</p>
            ) : (
              views.map((view, index) => {
                const isMobile = /Mobile|Android|iPhone|iPad/i.test(view.user_agent || '');
                const location = [view.geoip_city, view.geoip_country]
                  .filter(Boolean)
                  .join(', ');
                const timeAgo = getTimeAgo(new Date(view.date)).replace(' ago', '');

                return (
                  <div key={index} className="flex items-center gap-3 py-2 px-4 rounded-md bg-card">
                    <i aria-hidden="true" className={`${isMobile ? 'icon-smartphone' : 'icon-computer'} size-5 text-tertiary`} />
                    <div className="flex-1">
                      <p className="text-sm">Visitor from Direct</p>
                      <div className="flex items-center gap-0.5">
                        <i aria-hidden="true" className="icon-location-outline size-3 text-tertiary" />
                        <p className="text-sm text-tertiary">{location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-tertiary">{timeAgo}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">
        <div className="space-y-3">
          <p>Sources</p>
          <div className="space-y-2">
            {topViewsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton animate className="h-5 w-24" />
                  <Skeleton animate className="h-5 w-10" />
                </div>
              ))
            ) : bySources.length === 0 ? (
              <p className="text-tertiary text-sm">No data yet</p>
            ) : (
              bySources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-secondary text-sm">{getSourceLabel(source.utm_source)}</p>
                  <p className="text-sm">{getPercentage(source.count)}%</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p>Cities</p>
          <div className="space-y-2">
            {topViewsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton animate className="h-5 w-32" />
                  <Skeleton animate className="h-5 w-10" />
                </div>
              ))
            ) : byCities.length === 0 ? (
              <p className="text-tertiary text-sm">No data yet</p>
            ) : (
              byCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-secondary text-sm">{[city.geoip_city, city.geoip_country].filter(Boolean).join(', ') || 'Unknown'}</p>
                  <p className="text-sm">{getPercentage(city.count)}%</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p>UTM Sources</p>
          <p className="text-tertiary text-sm">
            Set up a tracking link by adding <code className="font-mono">?utm_source=your-link-name</code> to your URL.
          </p>
        </div>
      </div>
    </div>
  );
}
