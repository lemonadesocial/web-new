export function StatItem({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="py-3 px-4 rounded-md border-card-border bg-card">
      <p className="text-sm text-tertiary">{title}</p>
      {
        typeof value === 'string' ? (
          <p>{value}</p>
        ) : value
      }
    </div>
  );
}
