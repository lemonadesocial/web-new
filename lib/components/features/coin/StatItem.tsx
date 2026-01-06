import { Skeleton } from '$lib/components/core';

export function StatItem({ title, value, loading }: { title: string; value: React.ReactNode; loading?: boolean }) {
  return (
    <div className="py-3 px-4 rounded-md border-card-border bg-card">
      <p className="text-sm text-tertiary">{title}</p>
      {loading ? (
        <Skeleton className="h-5 w-24" animate />
      ) : (
        typeof value === 'string' ? (
          <p>{value}</p>
        ) : value
      )}
    </div>
  );
}
