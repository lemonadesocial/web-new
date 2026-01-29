export const StatCard = ({
  label,
  value,
  loading: isLoading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) => (
  <div className="py-3 px-4 rounded-md border-card-border bg-card">
    {isLoading ? (
      <div className="h-5 w-16 rounded bg-primary/12 animate-pulse" />
    ) : (
      <p>{value}</p>
    )}
    <p className="text-secondary text-sm">{label}</p>
  </div>
);
